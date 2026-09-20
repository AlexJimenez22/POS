namespace backend.Models.DTOs.Unit;

public class DTO_UnitCreate
{
    public string Name { get; set; } = string.Empty;
    public string Abbreviation { get; set; } = string.Empty;
    
    public bool Enable { get; set; }

}