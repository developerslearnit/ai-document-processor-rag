// Author: Adesina Mark Omoniyi
using AIDocument.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AIDocument.Infrastructure.Data.Configurations;

public class DocumentConfiguration : IEntityTypeConfiguration<Document>
{
    public void Configure(EntityTypeBuilder<Document> builder)
    {
        builder.HasKey(d => d.Id);
        
        builder.Property(d => d.FileName).IsRequired().HasMaxLength(255);
        builder.Property(d => d.Status).HasConversion<string>();
        
        builder.HasMany(d => d.Chunks)
               .WithOne(c => c.Document)
               .HasForeignKey(c => c.DocumentId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
