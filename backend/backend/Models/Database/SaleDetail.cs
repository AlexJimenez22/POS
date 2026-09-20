using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models.Database;

public class SaleDetail
{
    [Key]
    public int PKSaleDetail { get; set; }
    public float Quantity { get; set; }
    public float UnitPrice { get; set; }
    public float Discount { get; set; }
    public float TotalProduct { get; set; }
    
    public int FKSale { get; set; } 
    public int FKProduct { get; set; }

    [ForeignKey(nameof(FKSale))]
    public virtual Sale? Sale { get; set; }
    [ForeignKey(nameof(FKProduct))]
    public virtual Product? Product { get; set; }
}