using AIDocument.Domain.Enums;

namespace AIDocument.Domain.Entities;

public class Document
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string FileName { get; set; } = string.Empty;
    public string BlobUrl { get; set; } = string.Empty;
    public DocumentStatus Status { get; set; } = DocumentStatus.Uploaded;
    public string? Summary { get; set; }
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public ICollection<DocumentChunk> Chunks { get; set; } = new List<DocumentChunk>();
}
