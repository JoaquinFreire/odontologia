using Application.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            return BadRequest(new { message = "Email y contraseña son requeridos" });

        var user = await _authService.Login(request.Email, request.Password);
        if (user == null)
            return Unauthorized(new { message = "Credenciales inválidas" });

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.id.ToString()),
            new Claim(ClaimTypes.Email, user.email),
            new Claim(ClaimTypes.Name, $"{user.name} {user.lastname}")
        };

        var identity = new ClaimsIdentity(
            claims,
            CookieAuthenticationDefaults.AuthenticationScheme
        );

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(identity)
        );

        return Ok(new { 
            success = true,
            id = user.id,
            email = user.email,
            name = user.name,
            lastname = user.lastname,
            message = "Login exitoso"
        });
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync();
        return Ok(new { message = "Logout exitoso" });
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult GetMe()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var fullName = User.FindFirst(ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(email))
            {
                return Unauthorized(new { message = "Usuario no autenticado" });
            }

            return Ok(new { 
                authenticated = true,
                id = userId,
                email = email,
                name = fullName
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error al obtener datos del usuario" });
        }
    }
}

public record LoginRequest(string Email, string Password);
