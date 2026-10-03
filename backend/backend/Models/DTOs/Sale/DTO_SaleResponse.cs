using backend.Models.Database;
using backend.Models.DTOs.General;

namespace backend.Models.DTOs.Sale;

public class DTO_SaleResponse
{   
    public int PKSale { get; set; }
    public float DiscountAmount { get; set; }
    public float ReceivedAmount { get; set; }
    public float ChangeAmount { get; set; }
    public float Subtotal { get; set; }
    public float Total { get; set; }
    public DateTime? RegisterDate { get; set; }
    public DateTime? UpdateDate { get; set; }
    public Boolean Enable { get; set; }
    
    public float? CashReceived { get; set; }
    public float? CardReceived { get; set; }
    public float? TransferReceived { get; set; }
    
    
    public DTO_MinimalUser? User { get; set; }
    public List<DTO_DetailResponse> Details { get; set; }
}