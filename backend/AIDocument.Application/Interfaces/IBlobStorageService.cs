// Author: Adesina Mark Omoniyi
namespace AIDocument.Application.Interfaces;

public interface IBlobStorageService
{
    Task<string> UploadFileAsync(string fileName, Stream content, string contentType, CancellationToken cancellationToken = default);
    Task<Stream> DownloadFileAsync(string fileName, CancellationToken cancellationToken = default);
}
