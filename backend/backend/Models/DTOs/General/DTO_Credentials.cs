namespace backend.Models.DTOs.General;

public class DTO_Credentials
{
    public int UserNumber { get; set; }
    public string Password { get; set; }  = string.Empty;
}