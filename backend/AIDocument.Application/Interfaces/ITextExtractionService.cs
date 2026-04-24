// Author: Adesina Mark Omoniyi
namespace AIDocument.Application.Interfaces;

public interface ITextExtractionService
{
    Task<string> ExtractTextAsync(Stream fileStream, string contentType, CancellationToken cancellationToken = default);
}
