using BeSmachot.Server.Models;

namespace BeSmachot.Server.Services;

public interface IJwtTokenService
{
    string CreateToken(AppUser user);
}
