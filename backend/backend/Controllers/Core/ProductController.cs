using backend.Data;
using backend.Models.Database;
using backend.Models.DTOs.General;
using backend.Models.DTOs.Product;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Core;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    
    private readonly ApplicationDbContext _db;
    
    public ProductController(ApplicationDbContext db)
    {
        _db = db;
    }
    
    [HttpGet("get-allProducts")]
    public async Task<IActionResult> GetAllProducts()
    {
        try
        {
            List<DTO_ProductResponse> products = await _db.Product
                .Include(q => q.CreatedBy)
                .Include(q => q.UpdatedBy)
                .Include(q => q.Unit)
                .Select(q => new DTO_ProductResponse()
                {
                    PKProduct =  q.PKProduct,
                    SerialNumber = q.SerialNumber,
                    Name = q.Name,
                    Price = q.Price,
                    MinPrice = q.MinPrice,
                    Quantity = q.Quantity,
                    MinQuantity = q.MinQuantity,
                    RegisterDate = q.RegisterDate ?? null,
                    UpdateDate = q.UpdateDate ?? null,
                    Enable =  q.Enable,
                    CreatedBy = q.CreatedBy != null ? new DTO_MinimalUser()
                    {
                        PKUser = q.CreatedBy.PKUser,
                        Name = q.CreatedBy.Name,
                        Lastname =  q.CreatedBy.Lastname
                    } : null,
                    UpdatedBy = q.UpdatedBy != null ? new DTO_MinimalUser()
                    {
                        PKUser = q.UpdatedBy.PKUser,
                        Name = q.UpdatedBy.Name,
                        Lastname =  q.UpdatedBy.Lastname
                    } : null,
                    Unit = q.Unit != null ? new DTO_MinimalUnit()
                    {
                        PKUnit = q.Unit.PKUnit,
                        Name = q.Unit.Name,
                        Abbreviation =  q.Unit.Abbreviation,
                    } : null,
                }).ToListAsync();
            
            return Ok( new {success = true, message = "Productos Obtenidos Correctamente", data = products } );
        }
        catch (Exception ex)
        {
            return BadRequest(new {success = false,  message = ex.Message});
        }
    }
    
    [HttpGet("get-allProductsEnable")]
    public async Task<IActionResult> GetAllProductsEnable()
    {
        try
        {
            List<DTO_ProductResponse> products = await _db.Product
                .Where(q => q.Enable == true)
                .Include(q => q.CreatedBy)
                .Include(q => q.UpdatedBy)
                .Include(q => q.Unit)
                .Select(q => new DTO_ProductResponse()
                {
                    PKProduct =  q.PKProduct,
                    SerialNumber = q.SerialNumber,
                    Name = q.Name,
                    Price = q.Price,
                    MinPrice = q.MinPrice,
                    Quantity = q.Quantity,
                    MinQuantity = q.MinQuantity,
                    RegisterDate = q.RegisterDate ?? null,
                    UpdateDate = q.UpdateDate ?? null,
                    Enable =  q.Enable,
                    CreatedBy = q.CreatedBy != null ? new DTO_MinimalUser()
                    {
                        PKUser = q.CreatedBy.PKUser,
                        Name = q.CreatedBy.Name,
                        Lastname =  q.CreatedBy.Lastname
                    } : null,
                    UpdatedBy = q.UpdatedBy != null ? new DTO_MinimalUser()
                    {
                        PKUser = q.UpdatedBy.PKUser,
                        Name = q.UpdatedBy.Name,
                        Lastname =  q.UpdatedBy.Lastname
                    } : null,
                    Unit = q.Unit != null ? new DTO_MinimalUnit()
                    {
                        PKUnit = q.Unit.PKUnit,
                        Name = q.Unit.Name,
                        Abbreviation =  q.Unit.Abbreviation,
                    } : null,
                }).ToListAsync();
            
            return Ok( new {success = true, message = "Productos Obtenidos Correctamente", data = products } );
        }
        catch (Exception ex)
        {
            return BadRequest(new {success = false,  message = ex.Message});
        }
    }
    
    [HttpPost("post-newProduct")]
    public async Task<IActionResult> PostNewProduct(DTO_ProductCreate product)
    {
        try
        {
            Product productExists = await _db.Product.FirstOrDefaultAsync(q => q.SerialNumber == product.SerialNumber);
            
            if(productExists != null) return BadRequest(new {success = false, message = "Este producto ya ha sido registrado" });
            
            Product newProduct = new Product()
            {
                Name = product.Name,
                SerialNumber = product.SerialNumber,
                Price = product.Price,
                MinPrice = product.MinPrice,
                Quantity = product.Quantity,
                MinQuantity = product.MinQuantity,
                RegisterDate = DateTime.UtcNow,
                Enable = product.Enable,
                FKCreatedBy = product.FKCreatedBy,
                FKUnit =  product.FKUnit,
            };
            
            await _db.Product.AddAsync(newProduct);
            
            await _db.SaveChangesAsync();
            return Ok(new { success = true, message = "Producto creado correctamente" });
        }
        catch (Exception ex)
        {
            return BadRequest(new {success = false, message = ex.Message});
        }
    }

    [HttpPut("put-product/{idProduct:int}")]
    public async Task<IActionResult> PutProduct(int idProduct, DTO_ProductCreate product)
    {
        try
        {
           Product productExists = await _db.Product.FindAsync(idProduct);
           
           if(productExists == null) return BadRequest(new {success = false, message = "Producto no encontrado" });
           
           productExists.Name = product.Name;
           productExists.SerialNumber = product.SerialNumber;
           productExists.Price = product.Price;
           productExists.MinPrice = product.MinPrice;
           productExists.Quantity = product.Quantity;
           productExists.MinQuantity = product.MinQuantity;
           productExists.UpdateDate = DateTime.UtcNow;
           productExists.FKUpdatedBy = product.FKUpdatedBy;
           productExists.Enable = product.Enable;
           productExists.FKUnit = product.FKUnit;
           
           await  _db.SaveChangesAsync();
           
           return Ok(new { success = true, message = "Producto actualizado correctamente" });
        }
        catch (Exception ex)
        {
            return BadRequest(new {success = false, message = ex.Message});
        }
    }
    
}