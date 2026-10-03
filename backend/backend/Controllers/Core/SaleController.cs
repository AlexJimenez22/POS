using backend.Data;
using backend.Models.Database;
using backend.Models.DTOs.General;
using backend.Models.DTOs.Product;
using backend.Models.DTOs.Sale;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Core;

[ApiController]
[Route("api/[controller]")]
public class SaleController : ControllerBase
{
    private ApplicationDbContext _db;
    
    public SaleController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet("get-allSales")]
    public async Task<IActionResult> GetAllSales()
    {
        try
        {
            List<DTO_SaleResponse> sales = await _db.Sale
                .Include(s => s.SaleDetails)
                .ThenInclude(d => d.Product)
                .Include(s => s.User)
                .Select(s => new DTO_SaleResponse
                {
                    PKSale = s.PKSale,
                    DiscountAmount = s.DiscountAmount,
                    ReceivedAmount = s.ReceivedAmount,
                    ChangeAmount = s.ChangeAmount,
                    Subtotal = s.Subtotal,
                    Total = s.Total,
                    RegisterDate = s.RegisterDate,
                    UpdateDate = s.UpdateDate,
                    Enable = s.Enable,
                
                    User = s.User != null ? new DTO_MinimalUser
                    {
                        PKUser = s.User.PKUser,
                        Name = s.User.Name,
                        Lastname =  s.User.Lastname,
                        Role = s.User.Role,
                    } : null,

                    Details = s.SaleDetails.Select(d => new DTO_DetailResponse
                    {
                        PKSaleDetail = d.PKSaleDetail,
                        Quantity = d.Quantity,
                        UnitPrice = d.UnitPrice,
                        Discount = d.Discount,
                        TotalProduct = d.TotalProduct,
                        Product = new DTO_MinimalProduct()
                        {
                            PKProduct = d.Product.PKProduct,
                            Name = d.Product.Name,
                            Price = d.Product.Price,
                            AbbreviationUnit = d.Product.Unit.Abbreviation,
                        }
                    }).ToList()
                })
                .ToListAsync();
        
            return Ok(new { success = true, data = sales });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });    
        }
    }

    [HttpPost("post-newSale")]
    public async Task<IActionResult> PostNewSale([FromBody] DTO_SaleCreate sale)
    {
        using var transaction = _db.Database.BeginTransaction();
        try
        {
            foreach (var item in sale.Items)
            {
                Product product = await _db.Product.FirstOrDefaultAsync(q => q.PKProduct == item.FKProduct);
                
                if(product == null) return BadRequest(new {success = false, message = $"El producto con el id {item.FKProduct} no existe."});
                
                if(product.Quantity < item.Quantity) return BadRequest(new {success = false, message = $"{product.Name} no tiene el stock suficiente."});
                
                product.Quantity -= item.Quantity;
            }
            
            
            Sale newSale = new Sale()
            {
                DiscountAmount = sale.DiscountAmount,
                ChangeAmount = sale.ChangeAmount,
                ReceivedAmount =  sale.ReceivedAmount,  
                PayCard = sale.PayCard,
                PayCash = sale.PayCash,
                PayTransfer =  sale.PayTransfer,
                CashReceived =  sale.CashReceived,
                CardReceived =   sale.CardReceived,
                TransferReceived =   sale.TransferReceived,
                Subtotal = sale.Subtotal,
                Total = sale.Total,
                RegisterDate =  DateTime.UtcNow,
                FKUser = sale.FKUser,
                Enable = true
            };
            
            await _db.Sale.AddAsync(newSale);
            await _db.SaveChangesAsync();

            foreach (var item in sale.Items)
            {
                SaleDetail newSaleDetail = new SaleDetail()
                {
                   Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    Discount = item.Discount ?? 0,
                    TotalProduct = item.TotalItem,
                    FKSale = newSale.PKSale,
                    FKProduct = item.FKProduct
                };

                await _db.SaleDetail.AddAsync(newSaleDetail);
            }
            
            await _db.SaveChangesAsync();

            await transaction.CommitAsync();
            
            return Ok(new {success = true, message = "Venta registrada con exito"});
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest(new {success = false, message = ex.Message});
        }
    }
    
}