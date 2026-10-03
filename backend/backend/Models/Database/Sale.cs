using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models.Database;

public class Sale
{
    [Key] 
    public int PKSale { get; set; }
    public float DiscountAmount { get; set; }
    public float ReceivedAmount { get; set; }
    public float ChangeAmount { get; set; }
    public float Subtotal { get; set; }
    public float Total { get; set; }
    public DateTime? RegisterDate { get; set; }
    public DateTime? UpdateDate { get; set; }
    public Boolean Enable { get; set; }
    
    public Boolean? PayCard { get; set; }
    public Boolean? PayCash { get; set; }
    public Boolean? PayTransfer { get; set; }
    
    public float? CardReceived { get; set; }
    public float? CashReceived { get; set; }
    public float? TransferReceived { get; set; }
    
    // Fks
    public int FKUser {get; set;}
    
    //Virtual
    [ForeignKey(nameof(FKUser))]
    public virtual User? User { get; set; }
    public virtual ICollection<SaleDetail> SaleDetails { get; set; } = new List<SaleDetail>();
    
}