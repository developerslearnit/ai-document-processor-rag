// Author: Adesina Mark Omoniyi
using System.ClientModel;
using AIDocument.Application.Interfaces;
using Azure.AI.OpenAI;
using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Configuration;
using OpenAI.Chat;
using OpenAI.Embeddings;
using ChatMessage = OpenAI.Chat.ChatMessage;

namespace AIDocument.Infrastructure.Services;

/// <summary>
/// Core implementation of the AI pipeline routing connecting backend systems directly to Azure OpenAI endpoints.
/// Exposes operations to generate vector embeddings arrays via text-embedding-ada-002 models, and chat responses via GPT-4.
/// </summary>
public class AzureOpenAIService : IEmbeddingService, IAIChatService
{
    // The native underlying OpenAI client wrapper from Azure
    private readonly AzureOpenAIClient _client;
    // Hardcoded or dynamically read target name for your embedding deployment inside Azure
    private readonly string _embeddingDeploymentName;
    // Hardcoded or dynamically read target name for your generative LLM deployment model via Azure
    private readonly string _chatDeploymentName;

    /// <summary>
    /// Bootstraps connection parameters referencing backend appsettings.json.
    /// </summary>
    public AzureOpenAIService(IConfiguration configuration)
    {
        // 1. Read strict remote endpoint mapping from environment variables or configs. Required guard clause.
        var endpoint = configuration["AzureOpenAI:Endpoint"] ?? throw new ArgumentNullException("AzureOpenAI:Endpoint is missing");
        
        // 2. Read sensitive API token logic securely. Required guard clause.
        var apiKey = configuration["AzureOpenAI:ApiKey"] ?? throw new ArgumentNullException("AzureOpenAI:ApiKey is missing");
        
        // 3. Define fallback constants if deployment mappings are missing.
        _embeddingDeploymentName = configuration["AzureOpenAI:EmbeddingDeploymentName"] ?? "text-embedding-ada-002";
        _chatDeploymentName = configuration["AzureOpenAI:ChatDeploymentName"] ?? "gpt-4";

        // 4. Construct the official client abstraction with Microsoft's credential tokenizer.
        _client = new AzureOpenAIClient(new Uri(endpoint), new ApiKeyCredential(apiKey));
    }

    /// <summary>
    /// Submits plain text sequences to generate fixed-sized multidimensional vectors.
    /// </summary>
    /// <param name="text">The raw context string requiring numerical computation.</param>
    /// <param name="cancellationToken">Standard async abort signal boundary.</param>
    /// <returns>1536 sequence span of float vectors mapping to semantic context.</returns>
    public async Task<ReadOnlyMemory<float>> GenerateEmbeddingAsync(string text, CancellationToken cancellationToken = default)
    {
        // 1. Isolate the specific nested embedding sub-client connected to target deployment constraints.
        var embeddingClient = _client.GetEmbeddingClient(_embeddingDeploymentName);
        
        // 2. Perform the async network HTTP call requesting the computation map.
        var response = await embeddingClient.GenerateEmbeddingAsync(text, cancellationToken: cancellationToken);
        
        // 3. Extract the underlying numerical representation and force cast float array compatibility cleanly.
        return response.Value.ToFloats();
    }

    /// <summary>
    /// Generates grounded conversational responses leveraging retrieved context elements purely to avert hallucination models.
    /// </summary>
    /// <param name="question">The user's direct chat box inquiry.</param>
    /// <param name="contexts">A list of raw text fragments identified by pgvector as deeply similar via L2 distance mapping.</param>
    /// <param name="cancellationToken">Async abort flag.</param>
    /// <returns>The LLM's string representation answer.</returns>
    public async Task<string> GetChatResponseAsync(string question, IEnumerable<string> contexts, CancellationToken cancellationToken = default)
    {

        var contextString = string.Join("\n\n", contexts);

        var systemMessage = $@"You are an AI assistant.
                            Use ONLY the provided context.
                            If the answer is not in the context, say ""I don't know"".

                            Context:
                            {contextString}";


        ChatClientAgent chatAgent = _client.GetChatClient(_chatDeploymentName).AsAIAgent(instructions:systemMessage); // Ensure we have the interface abstraction for chat operations.


        var response  = await chatAgent.RunAsync(question, cancellationToken: cancellationToken);


        return response.Text;
    }

    /// <summary>
    /// Specialized fast-pass request generating a universal abstraction context element from a raw string.
    /// </summary>
    public async Task<string> GenerateSummaryAsync(string extractedText, CancellationToken cancellationToken = default)
    {
        var systemMessage = "You are a helpful assistant. Please summarize the following document. Extract key insights and present them clearly.";

        var chatAgentClient = _client.GetChatClient(_chatDeploymentName).AsAIAgent(instructions:systemMessage);
       
        var response = await chatAgentClient.RunAsync(extractedText, cancellationToken: cancellationToken);
        
        
        return response.Text;
    }
}
