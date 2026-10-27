using System.ComponentModel.DataAnnotations;

namespace BeSmachot.Server.DTOs;

public record RegisterRequest(
    [Required, MaxLength(120)] string FullName,
    [Required, EmailAddress] string Email,
    [Required, MinLength(6), MaxLength(100)] string Password);

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password);

public record UserDto(Guid Id, string FullName, string Email);

public record AuthResponse(string Token, UserDto User);
