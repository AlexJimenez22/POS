using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models.Database;

public class Product
{
    [Key]
    public int PKProduct { get; set; }
    public string SerialNumber { get; set; }
    public string Name { get; set; } = string.Empty;
    public float Price { get; set; }
    public float Quantity { get; set; }
    public float MinQuantity { get; set; }
    public float MinPrice { get; set; }
    public DateTime? RegisterDate { get; set; }
    public DateTime? UpdateDate { get; set; }
    public bool? Enable { get; set; }
    
    // FKs
    public int? FKCreatedBy { get; set; }
    public int? FKUpdatedBy { get; set; }
    public int? FKUnit { get; set; }
    
    //Virtuals
    [ForeignKey(nameof(FKCreatedBy))]
    public virtual User? CreatedBy { get; set; }
    [ForeignKey(nameof(FKUpdatedBy))]
    public virtual User? UpdatedBy { get; set; }
    [ForeignKey(nameof(FKUnit))]
    public virtual Unit? Unit { get; set; }
}