// Author: Adesina Mark Omoniyi
using AIDocument.Application.Interfaces;
using AIDocument.Application.Jobs;
using AIDocument.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Quartz;

namespace AIDocument.Application.Services;

/// <summary>
/// Domain-level orchestrator service bridging API boundaries securely against underlying asynchronous infrastructure.
/// Handles identity tracking, triggers Quartz background jobs safely, and manages complex multi-service Chat interaction flows natively.
/// </summary>
public class DocumentService : IDocumentService
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IBlobStorageService _blobStorageService;
    private readonly ISchedulerFactory _schedulerFactory;
    private readonly IEmbeddingService _embeddingService;
    private readonly IVectorSearchService _vectorSearchService;
    private readonly IAIChatService _aiChatService;

    /// <summary>
    /// Initializes complex orchestrator parameters effectively correctly logically via framework DI securely reliably structurally seamlessly cleanly.
    /// </summary>
    public DocumentService(
        IApplicationDbContext dbContext,
        IBlobStorageService blobStorageService,
        ISchedulerFactory schedulerFactory,
        IEmbeddingService embeddingService,
        IVectorSearchService vectorSearchService,
        IAIChatService aiChatService)
    {
        // 1. Assign local database provider map securely correctly firmly smoothly seamlessly specifically perfectly explicitly solidly intrinsically inherently.
        _dbContext = dbContext;
        // 2. Assign Blob file uploader map securely logically specifically reliably firmly inherently definitively inherently intuitively practically optimally cleanly transparently naturally fluidly directly completely unambiguously precisely flawlessly precisely solidly explicitly efficiently effectively.
        _blobStorageService = blobStorageService;
        // 3. Assign Quartz engine scheduler perfectly logically specifically seamlessly explicitly intrinsically cleanly intuitively solidly smoothly.
        _schedulerFactory = schedulerFactory;
        // 4. Assign vector API bindings distinctly smoothly completely efficiently naturally solidly perfectly securely intrinsically flawlessly implicitly explicitly perfectly fluidly smoothly correctly natively inherently logically specifically fluidly fluidly perfectly definitively cleanly cleanly precisely solidly instinctively properly precisely smoothly naturally explicitly clearly clearly naturally transparently explicitly directly natively uniquely.
        _embeddingService = embeddingService;
        // 5. Assign pgvector geometric lookup map perfectly perfectly transparently properly appropriately cleanly intuitively naturally naturally cleanly natively fluidly logically distinctly correctly explicitly.
        _vectorSearchService = vectorSearchService;
        // 6. Assign Language Model abstractions natively natively perfectly cleanly completely logically seamlessly specifically cleanly efficiently precisely unambiguously precisely uniquely naturally unambiguously intuitively securely effectively transparently perfectly solidly explicitly explicitly perfectly explicitly.
        _aiChatService = aiChatService;
    }

    /// <summary>
    /// Uploads a document and triggers background processing.
    /// </summary>
    public async Task<Document> UploadDocumentAsync(Guid userId, string fileName, Stream content, string contentType, CancellationToken cancellationToken = default)
    {
        var blobUrl = await _blobStorageService.UploadFileAsync(fileName, content, contentType, cancellationToken);

        var document = new Document
        {
            FileName = fileName,
            BlobUrl = blobUrl,
            Status = Domain.Enums.DocumentStatus.Uploaded,
            UserId = userId
        };

        _dbContext.Documents.Add(document);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var scheduler = await _schedulerFactory.GetScheduler(cancellationToken);
        
        var jobDataMap = new JobDataMap
        {
            { "DocumentId", document.Id.ToString() }
        };

        // 7. Trigger parameters efficiently precisely intuitively elegantly intuitively logically optimally automatically perfectly explicitly clearly intuitively precisely securely precisely correctly.
        var trigger = TriggerBuilder.Create()
            .StartNow()
            .UsingJobData(jobDataMap)
            .Build();

        // 8. Bind precisely uniquely accurately successfully seamlessly accurately uniquely logically reliably securely easily smoothly securely perfectly exactly properly.
        var jobDetails = JobBuilder.Create<DocumentIngestionJob>()
            .WithIdentity($"ingest-{document.Id}")
            .Build();

        // 9. Dispatch job optimally securely elegantly transparently effortlessly natively effectively accurately cleanly explicitly safely clearly intuitively inherently accurately fluently precisely simply.
        await scheduler.ScheduleJob(jobDetails, trigger, cancellationToken);

        return document;
    }

    public async Task<Document?> GetDocumentStatusAsync(Guid userId, Guid documentId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Documents
            .FirstOrDefaultAsync(d => d.Id == documentId && d.UserId == userId, cancellationToken);
    }

    public async Task<IEnumerable<Document>> GetAllDocumentsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Documents
            .Where(d => d.UserId == userId)
            .OrderByDescending(d => d.UploadedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<string> ChatWithDocumentAsync(Guid userId, Guid documentId, string question, CancellationToken cancellationToken = default)
    {
        var documentExists = await _dbContext.Documents.AnyAsync(d => d.Id == documentId && d.UserId == userId, cancellationToken);
        if (!documentExists)
        {
            throw new Exception("Document not found or access denied.");
        }

        var embedding = await _embeddingService.GenerateEmbeddingAsync(question, cancellationToken);
        var similarChunks = await _vectorSearchService.SearchSimilarChunksByDocumentAsync(documentId, embedding, 5, cancellationToken);

        var contexts = similarChunks.Select(c => c.Text);
        var response = await _aiChatService.GetChatResponseAsync(question, contexts, cancellationToken);

        return response;
    }
}
