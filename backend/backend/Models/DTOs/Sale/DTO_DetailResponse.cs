using backend.Models.DTOs.Product;

namespace backend.Models.DTOs.Sale;

public class DTO_DetailResponse
{   
    public int PKSaleDetail { get; set; }
    public float Quantity { get; set; }
    public float UnitPrice { get; set; }
    public float Discount { get; set; }
    public float TotalProduct { get; set; }
    public DTO_MinimalProduct? Product { get; set; }
}