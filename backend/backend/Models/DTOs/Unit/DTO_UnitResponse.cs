using backend.Models.DTOs.General;

namespace backend.Models.DTOs.Unit;

public class DTO_UnitResponse
{
    public int PKUnit { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Abbreviation { get; set; } = string.Empty;
    public DateTime? RegisterDate { get; set; }
    public DateTime? UpdateDate { get; set; }
    public bool Enable { get; set; }
    
    public DTO_MinimalUser? CreatedBy { get; set; }
    public DTO_MinimalUser? UpdatedBy { get; set; }
}