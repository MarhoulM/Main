using Microsoft.AspNetCore.Mvc;
using meetmeatApi.Data;
using meetmeatApi.Models;
using meetmeatApi.Dtos; 
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

using BCrypt.Net;
using Microsoft.IdentityModel.Tokens; 
using System.IdentityModel.Tokens.Jwt; 
using System.Security.Claims; 
using System.Text;

namespace meetmeatApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password) || string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest(new { Message = "Uživatelské jméno, e-mail a heslo jsou povinné." });
            }

            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                return BadRequest(new { Message = "Uživatelské jméno již existuje." });
            }
            if (await _context.Users.AnyAsync(u => u.Email == request.Email)) 
            {
                return BadRequest(new { Message = "Uživatel s tímto e-mailem již existuje." });
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var newUser = new User
            {
                Username = request.Username,
                Email = request.Email, 
                PasswordHash = passwordHash,

            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            
            var token = CreateToken(newUser);

            
            return Ok(new LoginResponseDto
            {
                Token = token,
                Username = newUser.Username,
                Email = newUser.Email 
            });
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized(new { Message = "Neplatné uživatelské jméno nebo heslo." });
            }

            var token = CreateToken(user);

            return Ok(new LoginResponseDto
            {
                Token = token,
                Username = user.Username,
                Email = user.Email 
            });
        }
        private string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username)
            };
            if (!string.IsNullOrEmpty(user.Email))
            {
                claims.Add(new Claim(ClaimTypes.Email, user.Email));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds,
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
