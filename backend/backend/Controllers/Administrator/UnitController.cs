using backend.Data;
using backend.Models.Database;
using backend.Models.DTOs.Unit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Developer;

[ApiController]
[Route("api/[controller]")]
public class UnitController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    
    public UnitController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet("get-allUnits")]
    public async Task<IActionResult> GetAllUnits()
    {
        try
        {
            List<Unit> units = await _db.Unit.ToListAsync();
            
            return Ok(new { success = true, data = units });
        }
        catch (Exception ex)
        {
            return BadRequest( new { success = false, message = ex.Message } );
        }
    }
    
    [HttpGet("get-allUnitsEnable")]
    public async Task<IActionResult> GetAllUnitsEnable()
    {
        try
        {
            List<Unit> units = await _db.Unit.Where(q => q.Enable == true).ToListAsync();
            
            return Ok(new { success = true, data = units });
        }
        catch (Exception ex)
        {
            return BadRequest( new { success = false, message = ex.Message } );
        }
    }
    
    [HttpPost("post-newUnit")]
    public async Task<IActionResult> PostNewUnit(DTO_UnitCreate newUnit)
    {
        try
        {
            Unit unit =  new Unit()
            {
                Name = newUnit.Name,
                Abbreviation = newUnit.Abbreviation,
                RegisterDate = DateTime.UtcNow,
                Enable = newUnit.Enable,
            };

            await _db.Unit.AddAsync(unit);
            
            await _db.SaveChangesAsync();
            
            
            return Ok(new { success = true, message = "Unidad añadida correctamente" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpPut("put-unit/{idUnit:int}")]
    public async Task<IActionResult> PutUnit(DTO_UnitCreate unit, int idUnit)
    {
        try
        {
            Unit unitExists = await _db.Unit.FindAsync(idUnit);
            
            if (unitExists == null) return BadRequest(new { success = false, message = "Unidad no encontrada" });
            
            unitExists.Name = unit.Name;
            unitExists.Abbreviation = unit.Abbreviation;
            unitExists.UpdateDate = DateTime.UtcNow;
            unitExists.Enable = unit.Enable;
            await _db.SaveChangesAsync();
            return Ok(new { success = true, message= "Unidad editada correctamente"});
        }
        catch (Exception ex)
        {
            return BadRequest(new {success= false, message = ex.Message });
        }
    }
}