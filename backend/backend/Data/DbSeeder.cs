using backend.Data;
using backend.Models.Database;

public static class DbSeeder
{
    public static void Seed(ApplicationDbContext db)
    {
        if (!db.User.Any())
        {
            DateTime registerDate = DateTime.UtcNow;
            string digitsDate = registerDate. ToString("ddMM");
            string genericPassword = $"pos-{digitsDate}";
            db.User.Add(new User()
            {
                Name = "Administrator",
                Lastname = "POS",
                Mail = "admin@pos_project.com",
                Password = BCrypt.Net.BCrypt.HashPassword(genericPassword),
                Role = "admin",
                RegisterDate = registerDate,
                Enable = true
            });

            db.SaveChanges();
        }
    }
}