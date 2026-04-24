// Author: Adesina Mark Omoniyi
using AIDocument.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AIDocument.Infrastructure.Data.Configurations;

public class DocumentChunkConfiguration : IEntityTypeConfiguration<DocumentChunk>
{
    public void Configure(EntityTypeBuilder<DocumentChunk> builder)
    {
        builder.HasKey(c => c.Id);
        
        builder.Property(c => c.Text).IsRequired();
        
        // 1536 is standard for OpenAI text-embedding outputs
        builder.Property(c => c.Embedding).HasColumnType("vector(1536)");
        
        // Add HNSW index for vector similarity search (L2 distance)
        builder.HasIndex(c => c.Embedding)
            .HasMethod("hnsw")
            .HasOperators("vector_l2_ops");
    }
}
