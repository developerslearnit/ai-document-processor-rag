// Author: Adesina Mark Omoniyi
using System.Security.Claims;
using AIDocument.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AIDocument.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DocumentsController : ControllerBase
{
    private readonly IDocumentService _documentService;

    public DocumentsController(IDocumentService documentService)
    {
        _documentService = documentService;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
            throw new UnauthorizedAccessException("User ID not found in token.");
            
        return Guid.Parse(userIdClaim.Value);
    }

    [HttpGet("health")]
    [AllowAnonymous]
    public IActionResult Health()
    {
        return Ok(new { Status = "Healthy", Timestamp = DateTime.UtcNow });
    }

    [HttpPost("upload")]
    [RequestSizeLimit(100_000_000)]
    public async Task<IActionResult> UploadDocument(IFormFile file, CancellationToken cancellationToken)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        using var stream = file.OpenReadStream();
        
        var userId = GetUserId();
        var document = await _documentService.UploadDocumentAsync(userId, file.FileName, stream, file.ContentType, cancellationToken);
        
        return Ok(new { document.Id, document.FileName, Status = document.Status.ToString() });
    }

    [HttpGet]
    public async Task<IActionResult> GetDocuments(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var docs = await _documentService.GetAllDocumentsAsync(userId, cancellationToken);
        
        var result = docs.Select(d => new
        {
            d.Id,
            d.FileName,
            Status = d.Status.ToString(),
            d.UploadedAt
        });
        
        return Ok(result);
    }

    [HttpGet("{id}/status")]
    public async Task<IActionResult> GetStatus(Guid id, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var document = await _documentService.GetDocumentStatusAsync(userId, id, cancellationToken);
        
        if (document == null) return NotFound();

        return Ok(new
        {
            document.Id,
            Status = document.Status.ToString(),
            document.Summary
        });
    }

    [HttpGet("{id}/summary")]
    public async Task<IActionResult> GetSummary(Guid id, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var document = await _documentService.GetDocumentStatusAsync(userId, id, cancellationToken);
        
        if (document == null) return NotFound();

        return Ok(new
        {
            document.Id,
            document.Summary
        });
    }

    [HttpPost("{id}/chat")]
    public async Task<IActionResult> Chat(Guid id, [FromBody] ChatRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Question))
            return BadRequest("Question cannot be empty.");

        var userId = GetUserId();
        var document = await _documentService.GetDocumentStatusAsync(userId, id, cancellationToken);
        
        if (document == null) return NotFound("Document not found.");
        
        if (document.Status != Domain.Enums.DocumentStatus.Completed)
            return BadRequest("Document is not fully processed yet.");

        var response = await _documentService.ChatWithDocumentAsync(userId, id, request.Question, cancellationToken);
        
        return Ok(new { Response = response });
    }
}

public class ChatRequest
{
    public string Question { get; set; } = string.Empty;
}
