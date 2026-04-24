// Author: Adesina Mark Omoniyi
using AIDocument.Application.Interfaces;
using AIDocument.Domain.Entities;
using AIDocument.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Quartz;

namespace AIDocument.Application.Jobs;

/// <summary>
/// Background job responsible for processing uploaded documents asynchronously.
/// This extracts text, generates an AI summary, chunks the text, computes vector embeddings,
/// and stores them into the pgvector database for RAG (Retrieval-Augmented Generation).
/// </summary>
public class DocumentIngestionJob : IJob
{
    // Database context to access documents and chunks directly
    private readonly IApplicationDbContext _dbContext;
    // Service to download the physical file data from Azure Blob Storage
    private readonly IBlobStorageService _blobStorageService;
    // Service to parse text out of PDFs, DOCXs, and TXTs
    private readonly ITextExtractionService _textExtractionService;
    // Service to send chunks to Azure OpenAI and return numerical vectors
    private readonly IEmbeddingService _embeddingService;
    // Service to ask LLMs for summarization
    private readonly IAIChatService _aiChatService;

    /// <summary>
    /// Initializes a new instance of the <see cref="DocumentIngestionJob"/> class.
    /// DI container injects these required dependencies.
    /// </summary>
    public DocumentIngestionJob(
        IApplicationDbContext dbContext,
        IBlobStorageService blobStorageService,
        ITextExtractionService textExtractionService,
        IEmbeddingService embeddingService,
        IAIChatService aiChatService)
    {
        // Store context for saving state
        _dbContext = dbContext;
        // Store blob service for file retrieval
        _blobStorageService = blobStorageService;
        // Store text extraction service for parsing text
        _textExtractionService = textExtractionService;
        // Store embedding service for generating chunk vectors
        _embeddingService = embeddingService;
        // Store the chat service to generate document summaries
        _aiChatService = aiChatService;
    }

    /// <summary>
    /// Quartz execute trigger. Orchestrates the full document ingestion pipeline.
    /// </summary>
    /// <param name="context">The Quartz execution context holding job parameters.</param>
    public async Task Execute(IJobExecutionContext context)
    {
        // 1. Extract the specific Document ID that triggered this job map.
        var documentIdStr = context.MergedJobDataMap.GetString("DocumentId");
        
        // 2. Validate that the string maps to a valid Guid construct.
        if (!Guid.TryParse(documentIdStr, out var documentId)) return;

        // 3. Look up the document in the SQL database.
        var document = await _dbContext.Documents.FindAsync(new object[] { documentId }, context.CancellationToken);
        
        // 4. If the document is missing, or is no longer 'Uploaded', abort to avoid duplicate work.
        if (document == null || document.Status != DocumentStatus.Uploaded) return;

        try
        {
            // 5. Instantly mark the document as 'Processing' to update frontend status.
            document.Status = DocumentStatus.Processing;
            // 6. Commit the status change.
            await _dbContext.SaveChangesAsync(context.CancellationToken);

            // 7. Securely stream the binary file content down from Azure Blob Storage to server memory.
            var blobName = Uri.UnescapeDataString(new Uri(document.BlobUrl).Segments.Last());
            using var fileStream = await _blobStorageService.DownloadFileAsync(blobName, context.CancellationToken);

            // 8. Determine the mime-type extension to instruct the extractors (pdf vs docx etc).
            var contentType = GetContentType(document.FileName);
            
            // 9. Hand the stream over to extraction parser to receive a large continuous raw text string.
            var extractedText = await _textExtractionService.ExtractTextAsync(fileStream, contentType, context.CancellationToken);

            // 10. Attempt to fetch a short generative AI summary of the document for the UI.
            try {
                // Call Azure OpenAI for an abstraction summary.
                document.Summary = await _aiChatService.GenerateSummaryAsync(extractedText, context.CancellationToken);
            } catch {
                // Ignore failure if the file is too large for the context window to summarize cleanly.
            }

            // 11. Chunk the giant text blob into reasonably sized overlapping segments suitable for the embedding model constraint.
            var chunks = ChunkText(extractedText, 3000); 

            // 12. Iterate through all the logical text chunks sequentially.
            for (var i = 0; i < chunks.Count; i++)
            {
                // Capture the actual string snippet.
                var textChunk = chunks[i];
                
                // 13. Send string snippet to Azure OpenAI to return the 1536-dimensional embedding.
                var embedding = await _embeddingService.GenerateEmbeddingAsync(textChunk, context.CancellationToken);

                // 14. Create the relational database entity model matching the schema.
                var docChunk = new DocumentChunk
                {
                    // Relate the chunk directly to the parent document payload.
                    DocumentId = documentId,
                    // Save the actual raw text content to display upon retrieval.
                    Text = textChunk,
                    // Track sequential chunk order for context reconstruction.
                    ChunkIndex = i,
                    // Map the raw float array into pgvector's strict 'Vector' type framework definition.
                    Embedding = new Pgvector.Vector(embedding)
                };

                // 15. Track entity in the DbContext memory space.
                _dbContext.DocumentChunks.Add(docChunk);
            }

            // 16. With chunking complete and tracked, set document metadata status as successfully completed.
            document.Status = DocumentStatus.Completed;
            
            // 17. Run a master SQL transaction to sync chunks and document updates simultaneously.
            await _dbContext.SaveChangesAsync(context.CancellationToken);
        }
        catch (Exception ex)
        {
            // 18. If any failure happens across blob, parser, or AI layer, mark standard failover status.
            document.Status = DocumentStatus.Failed;
            // 19. Send fail state mapping back to database.
            await _dbContext.SaveChangesAsync(context.CancellationToken);
            // 20. Re-throw to allow Quartz to manage dead lettering or retry triggers.
            throw new JobExecutionException(ex, false);
        }
    }

    /// <summary>
    /// Helper to convert a file extension strictly to a mime type to assist extraction branching.
    /// </summary>
    private string GetContentType(string filename)
    {
        // 1. Lowercase file extension natively parsing out the string trailing element.
        var ext = Path.GetExtension(filename).ToLowerInvariant();
        
        // 2. Perform switch case to hit defined standard content types map.
        return ext switch
        {
            ".pdf" => "application/pdf",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".txt" => "text/plain",
            // Fallback for an unknown boundary handler.
            _ => "application/octet-stream"
        };
    }

    /// <summary>
    /// A robust sliding-window basic string chunker splitting huge documents.
    /// </summary>
    private List<string> ChunkText(string text, int maxChunkLength)
    {
        // 1. Initialize working list memory container.
        var chunks = new List<string>();
        
        // 2. Iteratively march upwards until the text string runs out.
        for (int i = 0; i < text.Length; i += maxChunkLength)
        {
            // 3. Ensure the substr length pointer does not exceed absolute string dimensions.
            var length = Math.Min(maxChunkLength, text.Length - i);
            
            // 4. Allocate string boundaries into array.
            chunks.Add(text.Substring(i, length));
        }
        
        // 5. Send string lists.
        return chunks;
    }
}
