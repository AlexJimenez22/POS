namespace backend.Models.DTOs.Sale;

public class DTO_Item
{
    public int FKProduct { get; set; }
    public float Quantity { get; set; }
    public float? Discount { get; set; }
    public float UnitPrice { get; set; }
    public float  TotalItem { get; set; }
}