using Microsoft.EntityFrameworkCore;
using meetmeatApi.Models;

namespace meetmeatApi.Data 
{
    public class ApplicationDbContext : DbContext 
                                                  
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            
            modelBuilder.Entity<Product>().OwnsOne(p => p.DetailDescription); 

        }
    }
}