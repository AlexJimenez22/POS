using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models.Database;

public class Unit
{
    [Key]
    public int PKUnit { get; set; }
    
    public string Name { get; set; } = string.Empty;
    public string Abbreviation { get; set; } = string.Empty;
    
    public DateTime? RegisterDate { get; set; }
    public DateTime? UpdateDate { get; set; }
    public bool Enable { get; set; }
    
}