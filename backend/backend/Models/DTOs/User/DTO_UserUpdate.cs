using System.ComponentModel.DataAnnotations;

namespace backend.Models.DTOs;

public class DTO_UserUpdate
{
    [Required(ErrorMessage = "Name is required")]
    public string Name { get; set; } = string.Empty;
    [Required(ErrorMessage = "Lastname is required")]
    public string Lastname { get; set; } = string.Empty;
    [Required(ErrorMessage = "Mail is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Mail { get; set; } = string.Empty;
    [Required(ErrorMessage = "Role is required")]
    public string Role { get; set; } = string.Empty;
    public bool Enable { get; set; }
}