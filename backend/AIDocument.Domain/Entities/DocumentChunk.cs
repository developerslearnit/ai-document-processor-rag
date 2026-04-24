using Pgvector;

namespace AIDocument.Domain.Entities;

public class DocumentChunk
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid DocumentId { get; set; }
    public Document? Document { get; set; }
    public string Text { get; set; } = string.Empty;
    public int ChunkIndex { get; set; }
    public Vector? Embedding { get; set; }
}
