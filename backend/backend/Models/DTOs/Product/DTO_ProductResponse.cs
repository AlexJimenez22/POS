using backend.Models.DTOs.General;

namespace backend.Models.DTOs.Product;

public class DTO_ProductResponse
{
    public int PKProduct { get; set; }
    public string SerialNumber { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public float Price { get; set; }
    public float Quantity { get; set; }
    public float MinQuantity { get; set; }
    public float MinPrice { get; set; }
    public DateTime? RegisterDate { get; set; }
    public DateTime? UpdateDate { get; set; }
    public bool? Enable { get; set; }
    
    public DTO_MinimalUser? CreatedBy { get; set; }
    public DTO_MinimalUser? UpdatedBy { get; set; }
    public DTO_MinimalUnit? Unit { get; set; }
}