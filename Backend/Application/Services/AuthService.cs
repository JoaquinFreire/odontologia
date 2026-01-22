using System.Threading.Tasks;
using Application.Interfaces;
using BCrypt.Net;
using Domain.Entities;

namespace Application.Services;

public class AuthService
{
    private readonly IUserRepository _userRepository;

    public AuthService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<User?> Login(string email, string password)
    {
        var user = await _userRepository.GetByEmailAsync(email);

        if (user == null)
            return null;

        bool ok = BCrypt.Net.BCrypt.Verify(password, user.password_hash);

        return ok ? user : null;
    }
}
