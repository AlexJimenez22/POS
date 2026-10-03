namespace backend.Models.DTOs.Sale;

public class DTO_SaleCreate
{
    public int FKUser {get; set;}
    public float Total { get; set; }
    public float ReceivedAmount { get; set; }
    public float DiscountAmount { get; set; } 
    public float ChangeAmount { get; set; }
    public float Subtotal { get; set; }

    public Boolean? PayCard { get; set; } = false;
    public Boolean? PayCash { get; set; } = false;
    public Boolean? PayTransfer { get; set; } = false;

    public float? CardReceived { get; set; } = 0;
    public float? CashReceived { get; set; } = 0;
    public float? TransferReceived { get; set; } = 0;
    
    public DTO_Item[] Items { get; set; }
}