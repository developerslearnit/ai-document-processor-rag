// Author: Adesina Mark Omoniyi
using AIDocument.Application.Interfaces;
using DocumentFormat.OpenXml.Packaging;
using System.Text;
using UglyToad.PdfPig;

namespace AIDocument.Infrastructure.Services;

public class TextExtractionService : ITextExtractionService
{
    public async Task<string> ExtractTextAsync(Stream fileStream, string contentType, CancellationToken cancellationToken = default)
    {
        return contentType.ToLower() switch
        {
            "application/pdf" => ExtractFromPdf(fileStream),
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" => ExtractFromDocx(fileStream),
            "text/plain" => await ExtractFromTxtAsync(fileStream, cancellationToken),
            _ => throw new NotSupportedException($"Content type {contentType} is not supported.")
        };
    }

    private string ExtractFromPdf(Stream stream)
    {
        using var pdfDocument = PdfDocument.Open(stream);
        var sb = new StringBuilder();

        var pages = pdfDocument.GetPages();

        foreach (var page in pdfDocument.GetPages())
        {
            sb.AppendLine(page.Text);
        }
        return sb.ToString();
    }

    private string ExtractFromDocx(Stream stream)
    {
        using var doc = WordprocessingDocument.Open(stream, false);
        return doc.MainDocumentPart?.Document?.Body?.InnerText ?? string.Empty;
    }

    private async Task<string> ExtractFromTxtAsync(Stream stream, CancellationToken cancellationToken)
    {
        using var reader = new StreamReader(stream);
        return await reader.ReadToEndAsync(cancellationToken);
    }
}
