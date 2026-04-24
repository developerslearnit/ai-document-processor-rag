// Author: Adesina Mark Omoniyi
using AIDocument.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AIDocument.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Document> Documents { get; }
    DbSet<DocumentChunk> DocumentChunks { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
