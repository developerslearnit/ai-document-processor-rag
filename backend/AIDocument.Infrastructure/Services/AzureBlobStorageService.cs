// Author: Adesina Mark Omoniyi
using AIDocument.Application.Interfaces;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.Configuration;

namespace AIDocument.Infrastructure.Services;

public class AzureBlobStorageService : IBlobStorageService
{
    private readonly BlobContainerClient _containerClient;

    public AzureBlobStorageService(IConfiguration configuration)
    {
        var connectionString = configuration["AzureBlobStorage:ConnectionString"];
        var containerName = configuration["AzureBlobStorage:ContainerName"] ?? "ai-container";

        _containerClient = new BlobContainerClient(connectionString, containerName);
        _containerClient.CreateIfNotExists(PublicAccessType.Blob);
        //var blobServiceClient = new BlobServiceClient(connectionString);
        //_containerClient = blobServiceClient.GetBlobContainerClient(containerName);
        //_containerClient.CreateIfNotExists(PublicAccessType.None);
    }

    public async Task<string> UploadFileAsync(string fileName, Stream content, string contentType, CancellationToken cancellationToken = default)
    {
        var blobName = $"{Guid.NewGuid()}-{fileName}";
        var blobClient = _containerClient.GetBlobClient(blobName);

        var options = new BlobUploadOptions
        {
            HttpHeaders = new BlobHttpHeaders { ContentType = contentType }
        };

        await blobClient.UploadAsync(content, options, cancellationToken);

        return blobClient.Uri.ToString();
    }

    public async Task<Stream> DownloadFileAsync(string fileName, CancellationToken cancellationToken = default)
    {

        BlobClient blobClient;

        if (Uri.TryCreate(fileName, UriKind.Absolute, out var uri))
        {
            // Parse the URL -> container + blob name
            var blobUri = new Azure.Storage.Blobs.BlobUriBuilder(uri);

            // If your service is tied to one container, ensure it matches
            if (!string.Equals(blobUri.BlobContainerName, _containerClient.Name, StringComparison.OrdinalIgnoreCase))
            {
                return null; // or throw
            }

            blobClient = _containerClient.GetBlobClient(blobUri.BlobName);
        }
        else
        {
            // Treat as blob name
            blobClient = _containerClient.GetBlobClient(fileName);
        }

        if (!await blobClient.ExistsAsync())
        {
            return null;
        }

        var ms = new MemoryStream();
        await blobClient.DownloadToAsync(ms);
        ms.Position = 0;
        return ms;

    }
}
