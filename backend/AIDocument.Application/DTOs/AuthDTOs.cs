// Author: Adesina Mark Omoniyi
namespace AIDocument.Application.DTOs;

public record AuthRequest(string Email, string Password, string? FullName = null);
public record UserDto(Guid Id, string Email, string FullName);
public record AuthResponse(string Token, UserDto User);
