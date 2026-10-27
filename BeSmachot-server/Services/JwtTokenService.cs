using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BeSmachot.Server.Models;
using Microsoft.IdentityModel.Tokens;

namespace BeSmachot.Server.Services;

public class JwtTokenService(IConfiguration configuration) : IJwtTokenService
{
    public string CreateToken(AppUser user)
    {
        var key = configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("Jwt:Key is missing.");

        var expiryMinutes = int.TryParse(configuration["Jwt:ExpiryMinutes"], out var value)
            ? value
            : 120;

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Email, user.Email)
        };

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
