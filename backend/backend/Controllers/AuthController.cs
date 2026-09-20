using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Data;
using backend.Models.Database;
using backend.Models.DTOs.General;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{

    private readonly ApplicationDbContext _db;
    private readonly IConfiguration _configuration;
    
    public AuthController(ApplicationDbContext db, IConfiguration config)
    {
        _db = db;
        _configuration = config;
    }

    [HttpPost("post-logingAsk")]
    public async Task<IActionResult> PostLogingAsk(DTO_Credentials credentials)
    {
        try
        {
            User user = await _db.User.FirstOrDefaultAsync(q => q.PKUser == credentials.UserNumber);

            if (user == null)
            {
                return BadRequest(new {success= false, message= "Usuario no registrado"});
            }

            if (user.Enable == false)
            {
                return BadRequest(new { success = false, message = "Cuenta deshabilitada, contacta con tu administrador" });
            }

            if (!BCrypt.Net.BCrypt.Verify(credentials.Password, user.Password))
            {
                return BadRequest(new { success = false, message = "Credenciales incorrectas" });
            }
            
            string token =  GetJwt(user);

            DTO_MinimalUser userResponse = new DTO_MinimalUser()
            {
                PKUser = user.PKUser,
                Name = user.Name,
                Lastname = user.Lastname,
                Role = user.Role,
            };

            return Ok(new {success= true, message="Usuario autenticado correctamente", user=userResponse, token= token });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [NonAction]
    public string GetJwt(User user)
    {
        string secretKey = _configuration["Jwt:Key"];
        string issuer = _configuration["Jwt:Issuer"];
        string audience = _configuration["Jwt:Audience"];

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.PKUser.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Mail),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Role, user.Role)
        };
        
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: creds
            );

        var tokenHandler = new JwtSecurityTokenHandler();
        
        return tokenHandler.WriteToken(tokenDescriptor);
    }

}