namespace backend.Models.DTOs.Product;

public class DTO_ProductCreate
{

    public string Name { get; set; } = string.Empty;
    public string SerialNumber { get; set; } = string.Empty;
    public float Price { get; set; }
    public float Quantity { get; set; }
    public float MinQuantity { get; set; }
    public float MinPrice { get; set; }
    public bool? Enable { get; set; }
    public int? FKCreatedBy { get; set; }
    public int? FKUpdatedBy { get; set; }
    public int? FKUnit { get; set; }
    
}