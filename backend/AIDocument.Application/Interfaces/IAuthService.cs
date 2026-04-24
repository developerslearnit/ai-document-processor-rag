// Author: Adesina Mark Omoniyi
using AIDocument.Application.DTOs;

namespace AIDocument.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(string email, string password, string fullName);
    Task<AuthResponse> LoginAsync(string email, string password);
}
