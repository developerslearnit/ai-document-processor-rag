// Author: Adesina Mark Omoniyi
namespace AIDocument.Application.Interfaces;

public interface IEmbeddingService
{
    Task<ReadOnlyMemory<float>> GenerateEmbeddingAsync(string text, CancellationToken cancellationToken = default);
}
