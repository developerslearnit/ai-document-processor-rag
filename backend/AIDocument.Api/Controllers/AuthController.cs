// Author: Adesina Mark Omoniyi
using AIDocument.Application.DTOs;
using AIDocument.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AIDocument.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(AuthRequest request)
    {
        try
        {
            var response = await _authService.RegisterAsync(request.Email, request.Password, request.FullName ?? "");
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(AuthRequest request)
    {
        try
        {
            var response = await _authService.LoginAsync(request.Email, request.Password);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
