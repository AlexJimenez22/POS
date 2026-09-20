using System.ComponentModel.DataAnnotations;

namespace backend.Models.Database;

public class User
{
    [Key]
    public int PKUser { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string Mail { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime? RegisterDate { get; set; }
    public DateTime? UpdateDate { get; set; }
    public bool Enable { get; set; }
}