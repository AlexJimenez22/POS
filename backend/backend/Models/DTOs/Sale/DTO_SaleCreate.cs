namespace backend.Models.DTOs.Sale;

public class DTO_SaleCreate
{
    public int FKUser {get; set;}
    public float Total { get; set; }
    public float ReceivedAmount { get; set; }
    public float DiscountAmount { get; set; } 
    public float ChangeAmount { get; set; }
    public float Subtotal { get; set; }
    
    public DTO_Item[] Items { get; set; }
}