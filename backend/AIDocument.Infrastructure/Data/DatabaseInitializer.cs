// Author: Adesina Mark Omoniyi
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace AIDocument.Infrastructure.Data
{
    public static class DatabaseInitializer
    {
        public static async Task MigrateAndSeedAsync(this IServiceProvider services)
        {
            using IServiceScope scope = services.CreateScope();
            ApplicationDbContext dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            IEnumerable<string> migrations = await dbContext.Database.GetPendingMigrationsAsync();

            if (migrations.Any())
            {
                await dbContext.Database.MigrateAsync();
            }
        }
    }
}
