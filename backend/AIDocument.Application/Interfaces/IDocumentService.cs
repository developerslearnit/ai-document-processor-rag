// Author: Adesina Mark Omoniyi
using AIDocument.Domain.Entities;

namespace AIDocument.Application.Interfaces;

public interface IDocumentService
{
    Task<Document> UploadDocumentAsync(Guid userId, string fileName, Stream content, string contentType, CancellationToken cancellationToken = default);
    Task<Document?> GetDocumentStatusAsync(Guid userId, Guid documentId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Document>> GetAllDocumentsAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<string> ChatWithDocumentAsync(Guid userId, Guid documentId, string question, CancellationToken cancellationToken = default);
}
