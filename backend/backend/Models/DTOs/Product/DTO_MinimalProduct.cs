namespace backend.Models.DTOs.Product;

public class DTO_MinimalProduct
{
    public int PKProduct { get; set; }
    public string Name { get; set; }
    public float Price { get; set; }
    public string AbbreviationUnit { get; set; }
}