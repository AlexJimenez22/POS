namespace backend.Models.DTOs.General;

public class DTO_MinimalUser
{
    public int PKUser { get; set; }
    public string Name { get; set; } = "";
    public string Lastname { get; set; } = "";
    public string Role { get; set; } = "";
}