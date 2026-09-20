using backend.Models.Database;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) :  base(options)
    {
    }
    
    public DbSet<User> User { get; set; }
    public DbSet<Unit> Unit { get; set; }
    public DbSet<Product> Product { get; set; }
    public DbSet<Sale> Sale { get; set; }
    public DbSet<SaleDetail> SaleDetail { get; set; }
}