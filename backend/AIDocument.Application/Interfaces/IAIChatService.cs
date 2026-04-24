// Author: Adesina Mark Omoniyi
namespace AIDocument.Application.Interfaces;

public interface IAIChatService
{
    Task<string> GetChatResponseAsync(string question, IEnumerable<string> contexts, CancellationToken cancellationToken = default);
    Task<string> GenerateSummaryAsync(string extractedText, CancellationToken cancellationToken = default);
}
