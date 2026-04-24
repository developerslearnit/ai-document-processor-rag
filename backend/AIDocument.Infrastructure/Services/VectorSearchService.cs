// Author: Adesina Mark Omoniyi
using AIDocument.Domain.Entities;
using AIDocument.Application.Interfaces;
using AIDocument.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Pgvector.EntityFrameworkCore;
using Pgvector;

namespace AIDocument.Infrastructure.Services;

/// <summary>
/// Encapsulates the execution mapping translating numeric sequence arrays directly into hardware-level
/// 'nearest neighbor' geometric lookup operations natively accelerated by PostgreSQL's pgvector extension indices.
/// </summary>
public class VectorSearchService : IVectorSearchService
{
    // Primary EF Core context wrapping standard relational tables augmented natively with Vector capabilities.
    private readonly ApplicationDbContext _dbContext;

    /// <summary>
    /// Bootstraps vector geometry lookup mapping layers dynamically reading DI resolved framework elements.
    /// </summary>
    /// <param name="dbContext">The Entity Context holding connected sets to pgvector infrastructure bounds.</param>
    public VectorSearchService(ApplicationDbContext dbContext)
    {
        // 1. Store connection instance reference to execute remote lookup patterns securely.
        _dbContext = dbContext;
    }

    /// <summary>
    /// Executes a pure universal search traversing ALL generic documents globally. (Broad Retrieval).
    /// </summary>
    /// <param name="embedding">The natively computed dimensional representation of the natural language user inquiry.</param>
    /// <param name="limit">The literal ceiling 'K' matching element limiter clipping result arrays securely bounds processing capacity limits.</param>
    /// <param name="cancellationToken">Operational async kill command trigger bounds.</param>
    /// <returns>A collection natively retrieving the parent context logic combined cleanly via Include().</returns>
    public async Task<IEnumerable<DocumentChunk>> SearchSimilarChunksAsync(ReadOnlyMemory<float> embedding, int limit = 5, CancellationToken cancellationToken = default)
    {
        // 1. Morph generic float arrays explicitly into tightly bound 'Pgvector.Vector' structs recognized uniquely by the Extension pipeline rules.
        var queryVector = new Vector(embedding);
        
        // 2. Perform natively accelerated HNSW hardware SQL command translations against PostgreSQL native nodes via EF Core.
        return await _dbContext.DocumentChunks
            // 3. Utilize native '.L2Distance' tracking translation specifically pushing computation DOWN directly into the database bounds.
            .OrderBy(c => c.Embedding!.L2Distance(queryVector))
            // 4. Force top K limits explicitly enforcing low network bandwidth mapping sizes limits mapping execution limits.
            .Take(limit)
            // 5. Append Parent entity relational JOIN mappings into native EF request maps pulling Document headers explicitly.
            .Include(c => c.Document)
            // 6. Trigger execution boundaries and transform back cleanly to standard List<T> sequence map.
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Executes restricted geometry 'nearest neighbor' bounds uniquely constrained firmly inside a solitary target document ID tree logic mapping.
    /// This prevents answers bleeding across disparate client file uploads natively protecting isolation constraints logically via ID routing boundaries.
    /// </summary>
    /// <param name="documentId">The specific file Identity Guid ID.</param>
    /// <param name="embedding">The dense array numerical representation value translation array map.</param>
    /// <param name="limit">Boundary 'k' limiting sequence count constraint bounds.</param>
    /// <param name="cancellationToken">HTTP context cancellation abort switch mappings.</param>
    /// <returns>A list containing exactly those extracted string chunks closest mapping symmetrically the query intent space geometrically.</returns>
    public async Task<IEnumerable<DocumentChunk>> SearchSimilarChunksByDocumentAsync(Guid documentId, ReadOnlyMemory<float> embedding, int limit = 5, CancellationToken cancellationToken = default)
    {
        // 1. Re-box float sequence maps uniquely securely mapping natively to underlying geometry class parameters pgvector expects natively.
        var queryVector = new Vector(embedding);
        
        // 2. Frame specific remote database bounds request against tracked Chunk mapping tables context execution scopes.
        return await _dbContext.DocumentChunks
            // 3. APPLY ISOLATION: Execute standard strict equality matching ID limiter constraints completely separating files tightly bounds security boundaries.
            .Where(c => c.DocumentId == documentId)
            // 4. Execute Native Postgres pgvector Index sorting via L2 Distance Operator pushing raw heavy load computation firmly inside the DB memory layer natively.
            .OrderBy(c => c.Embedding!.L2Distance(queryVector))
            // 5. Return specifically strictly precise top K records matching natively mapped constraints exactly optimizing token boundaries effectively natively limits capacity overhead exactly bounds securely limits payload dimensions limits constraints appropriately natively.
            .Take(limit)
            // 6. Collapse asynchronous result payload bounds to native memory array collection bounds context effectively limits effectively bounds natively correctly efficiently natively natively natively explicitly inherently.
            .ToListAsync(cancellationToken);
    }
}
