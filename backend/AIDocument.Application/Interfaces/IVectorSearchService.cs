// Author: Adesina Mark Omoniyi
using AIDocument.Domain.Entities;

namespace AIDocument.Application.Interfaces;

public interface IVectorSearchService
{
    Task<IEnumerable<DocumentChunk>> SearchSimilarChunksAsync(ReadOnlyMemory<float> embedding, int limit = 5, CancellationToken cancellationToken = default);
    Task<IEnumerable<DocumentChunk>> SearchSimilarChunksByDocumentAsync(Guid documentId, ReadOnlyMemory<float> embedding, int limit = 5, CancellationToken cancellationToken = default);
}
