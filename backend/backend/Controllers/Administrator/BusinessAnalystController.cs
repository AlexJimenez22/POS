using System.IO.Compression;
using System.Text;
using backend.Data;
using backend.Models.Database;
using backend.Models.DTOs.General;
using backend.Models.DTOs.Product;
using backend.Models.DTOs.Sale;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Administrator;

[ApiController]
[Route("api/[controller]")]
public class BusinessAnalystController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public BusinessAnalystController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet("get-resumeToday")]
    public async Task<IActionResult> GetResumeToday()
    {
        try
        {
            DateTime initLocal = DateTime.Today;
            DateTime endLocal = initLocal.AddDays(1);

            DateTime initUtc = initLocal.ToUniversalTime();
            DateTime endUtc = endLocal.ToUniversalTime();
            
            float totalAmountSalesToday = await _db.Sale.Where(v => v.RegisterDate >= initUtc && v.RegisterDate < endUtc).SumAsync(v => v.Total);
            
            int totalSalesToday = await _db.Sale.CountAsync(v => v.RegisterDate >= initUtc && v.RegisterDate < endUtc);
            
            return Ok(new { success = true, totalSalesToday, totalAmountSalesToday, message = "Resumen del dia obtenido correctamente" });

        }
        catch (Exception ex)
        {
            return BadRequest(new {success = false, message = ex.Message});
        }
        
    }

    [HttpGet("get-productMetrics")]
    public async Task<IActionResult> GetProductMetrics()
    {
        try
        {
            double warningFactor = 1.25;

            var alertStock = await _db.Product
                .Where(q => q.Enable == true)
                .ToListAsync();

            var filterResults = alertStock
                .Where(p => p.Quantity <= Math.Ceiling(p.MinQuantity * warningFactor))
                .Select(p => new
                {
                    p.PKProduct,
                    p.Name,
                    p.MinQuantity,
                    p.Quantity,
                    State = p.Quantity <= p.MinQuantity ? "urgent" : "warning"
                }).ToList();
            
            DateTime initMonthLocal = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1);
            DateTime endMonthLocal = initMonthLocal.AddMonths(1);
            
            DateTime initMonthUtc = initMonthLocal.ToUniversalTime();
            DateTime endMonthUtc = endMonthLocal.ToUniversalTime();
            
            var topProducts = await _db.SaleDetail
                .Where(dv => dv.Sale.RegisterDate >= initMonthUtc && dv.Sale.RegisterDate < endMonthUtc)
                .GroupBy(dv => new {dv.FKProduct, dv.Product.Name, dv.Product.Unit.Abbreviation})
                .Select(group => new
                {
                    PKProduct = group.Key.FKProduct,
                    Name = group.Key.Name,
                    AbbreviationUnit = group.Key.Abbreviation,
                    TotalAmount = group.Sum(dv => dv.Quantity),
                })
                .OrderByDescending(q => q.TotalAmount)
                .Take(5)
                .ToListAsync();

            return Ok(new { success= true, alertStock = filterResults, topProducts, message = "Metricas de productos obtenidas correctamente" });

        }
        catch (Exception ex)
        {
            return BadRequest(new {success = false, message = ex.Message});
        }
    }

    [HttpGet("get-salesByRange")]
    public async Task<IActionResult> GetSalesByRange([FromQuery] string initDate, [FromQuery] string endDate)
    {
        try
        {
            if (string.IsNullOrEmpty(initDate) || string.IsNullOrEmpty(endDate))
            {
                return BadRequest(new { success = false, message = "Las fechas ingresadas no son validas" });
            }

            if (!DateTime.TryParse(initDate, out DateTime initLocal) ||
                !DateTime.TryParse(endDate, out DateTime endLocal))
            {
                return BadRequest(new {success = false, message = "Las fechas ingresadas no son validas (Formato)" });
            }

            endLocal = endLocal.AddDays(1);
            
            DateTime initUtc = initLocal.ToUniversalTime();
            DateTime endUtc = endLocal.ToUniversalTime();
            
            var sales = await _db.Sale
                .Where(q => q.RegisterDate >= initUtc && q.RegisterDate < endUtc)
                .Where(q => q.Enable == true)
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
                    CashReceived = s.CashReceived,
                    CardReceived = s.CardReceived,
                    TransferReceived = s.TransferReceived,
                    
    
                    User = s.User != null ? new DTO_MinimalUser
                    {
                        PKUser = s.User.PKUser,
                        Name = s.User.Name,
                        Lastname = s.User.Lastname,
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
            
            return Ok(new {success = true, data = sales, message= "Ventas obtenidas correctamente" });
        }
        catch (Exception ex)
        {
            return BadRequest(new {success = false, message = ex.Message});
        }
    }
    
    [HttpGet("get-generateReportByDateRange")]
    public async Task<IActionResult> GenerateReport(
        [FromQuery] string initDate,
        [FromQuery] string endDate,
        [FromQuery] string typeFile = "text")
    {
        try
        {
            if (!DateTime.TryParse(initDate, out DateTime initLocal) ||
                !DateTime.TryParse(endDate, out DateTime endLocal))
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Las fechas ingresadas no son validas"
                });
            }

            endLocal = endLocal.AddDays(1);
            

            DateTime initUtc = initLocal.ToUniversalTime();
            DateTime endUtc = endLocal.ToUniversalTime();

            Console.WriteLine(initUtc);
            Console.WriteLine(endUtc);
            var sales = await _db.Sale
                .Where(q => q.RegisterDate >= initUtc && q.RegisterDate < endUtc)
                .Where(q => q.Enable == true)
                .Select(s => new
                {
                    pkSale = s.PKSale,
                    discountAmount = s.DiscountAmount,
                    receivedAmount = s.ReceivedAmount,
                    total = s.Total,
                    changeAmount = s.ChangeAmount,
                    cashReceived = s.CashReceived,
                    cardReceived = s.CardReceived,
                    transferReceived = s.TransferReceived,
                    registerDate = s.RegisterDate,

                    userName = s.FKUser != null ? s.User.Name : null,
                })
                .ToListAsync();

            if (typeFile == "text")
            {
                var sb = new StringBuilder();

                sb.AppendLine("==========================================");
                sb.AppendLine("           CORTE DE CAJA - POS            ");
                sb.AppendLine("==========================================");
                sb.AppendLine($"Fecha Inicio: {initUtc}");
                sb.AppendLine($"Fecha Fin: {endUtc}");
                sb.AppendLine("------------------------------------------");
                sb.AppendLine(string.Format(
                    "{0,-8} {1,-10} {2,8} {3,8}",
                    "Folio",
                    "Efectivo",
                    "Tarjeta",
                    "Total"));
                sb.AppendLine("------------------------------------------");

                decimal totalCash = 0;
                decimal totalCard = 0;
                decimal totalTransfer = 0;
                decimal totalGeneral = 0;

                foreach (var sale in sales)
                {
                    sb.AppendLine(string.Format(
                        "#{0,-7} ${1,-9:N2} ${2,-7:N2} ${3,7:N2}",
                        sale.pkSale,
                        sale.cashReceived ?? 0,
                        sale.cardReceived ?? 0,
                        sale.total));

                    totalCash += (decimal)(sale.cashReceived ?? 0);
                    totalCard += (decimal)(sale.cardReceived ?? 0);
                    totalTransfer += (decimal)(sale.transferReceived ?? 0);
                    totalGeneral += (decimal)sale.total;
                }

                sb.AppendLine("------------------------------------------");
                sb.AppendLine("RESUMEN DE TOTALES:");
                sb.AppendLine($"(+) Efectivo:      ${totalCash:N2}");
                sb.AppendLine($"(+) Tarjeta:       ${totalCard:N2}");
                sb.AppendLine($"(+) Transferencia: ${totalTransfer:N2}");
                sb.AppendLine("------------------------------------------");
                sb.AppendLine($"(=) TOTAL CORTE:   ${totalGeneral:N2}");
                sb.AppendLine("==========================================");

                byte[] fileBytes = Encoding.UTF8.GetBytes(sb.ToString());

                string fileName = "Corte_Caja.txt";

                return File(fileBytes, "text/plain", fileName);
            }

            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                success = false,
                message = ex.Message
            });
        }
    }

    
}