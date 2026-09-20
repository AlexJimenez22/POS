using backend.Data;
using backend.Models.Database;
using backend.Models.DTOs;
using backend.Models.DTOs.General;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    
    public UserController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpPost("post-newUser")]
    public async Task<IActionResult> PostNewUser( DTO_UserCreate user )
    {
        try
        {
            User userExists = await _db.User.FirstOrDefaultAsync(q => q.Mail == user.Mail);
            
            if (userExists != null) return BadRequest( new {success = false, message = "Usuario ya existe"} );
            
            DateTime registerDate = DateTime.UtcNow;
            string digitsDate = registerDate. ToString("ddMM");
            string genericPassword = $"pos-{digitsDate}";

            User newUser = new User()
            {
                Name= user.Name,
                Lastname = user.Lastname,
                Mail = user.Mail,
                Password = BCrypt.Net.BCrypt.HashPassword(genericPassword),
                Role = user.Role,
                RegisterDate = DateTime.UtcNow,
                Enable = user.Enable
            };
            
            _db.User.Add(newUser);

            await _db.SaveChangesAsync();
            
            return Ok( new { success = true, message = "Usuario añadido correctamente" } );
        }
        catch (Exception ex)
        {
            return BadRequest( new { success = false, message = ex.Message } );
        }
    }

    [HttpGet("get-allUsers")]
    public async Task<IActionResult> GetAllUsers()
    {
        try
        {
            var users = await _db.User
                .Select(q => new DTO_UserResponse()
                {
                    PKUser = q.PKUser,
                    Name = q.Name,
                    Lastname = q.Lastname,
                    Mail = q.Mail,
                    Role = q.Role,
                    Enable = q.Enable,
                    RegisterDate = q.RegisterDate,
                    UpdateDate = q.UpdateDate
                }).ToListAsync();

            return Ok(new { success = true, message = "Usuarios obtenidos correctamente", data = users });
        }
        catch (Exception ex)
        {
            return BadRequest(new {success = false, message= ex.Message });
        }
    }

    [HttpPut("put-user/{idUser:int}")]
    public async Task<IActionResult> UpdateUser(DTO_UserUpdate user, int idUser)
    {
        try
        {
            User userExists = await _db.User.FirstOrDefaultAsync(q => q.PKUser == idUser);

            if (userExists == null)
            {
                return BadRequest(new { success = false, message = "Usuario no encontrado" });
            }
            
            userExists.Name = user.Name;
            userExists.Lastname = user.Lastname;
            userExists.Mail = user.Mail;
            userExists.Role = user.Role;
            userExists.Enable = user.Enable;
            userExists.UpdateDate = DateTime.UtcNow;
            
            await _db.SaveChangesAsync();
            
            return Ok( new { success = true, message = "Usuario actualizado correctamente" } );
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpGet("get-userById/{idUser:int}")]
    public async Task<IActionResult> GetUserById(int idUser)
    {
        try
        {
            User user =  await _db.User.FirstOrDefaultAsync(q => q.PKUser == idUser);
            
            if  (user == null) return BadRequest(new { success = false, message = "Usuario no encontrado" });
            
            return Ok( new { success = true, message = "Usuario obtenido correctamente", data = user } );
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpGet("get-minimalUserById/{idUser:int}")]
    public async Task<IActionResult> GetMinimalUser(int idUser)
    {
        try
        {
            User user = await _db.User.FirstOrDefaultAsync(q => q.PKUser == idUser);
            
            if (user == null) return BadRequest(new { success = false, message = "Usuario no encontrado" });

            DTO_MinimalUser minimalUser = new DTO_MinimalUser()
            {
                PKUser = user.PKUser,
                Name = user.Name,
                Lastname = user.Lastname,
                Role = user.Role,
            };
            
            return Ok(new {success= true, message= "Usuario obtenido correctamente", user= minimalUser });
        }
        catch (Exception ex)
        {
            return BadRequest(new {success= false, message= ex.Message });
        }
    }
}