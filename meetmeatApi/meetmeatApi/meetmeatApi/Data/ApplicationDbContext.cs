using Microsoft.EntityFrameworkCore;
using meetmeatApi.Models;

namespace meetmeatApi.Data 
{
    public class ApplicationDbContext : DbContext 
                                                  
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Product> Products { get; set; }

        public virtual DbSet<Order> Orders { get; set; } = default!;
        public virtual DbSet<OrderItem> OrderItems { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Order>().HasOne(o => o.User).WithMany(u => u.Orders).HasForeignKey(o => o.UserId).IsRequired(false).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Order>().HasMany(o => o.OrderItems)
            .WithOne(oi => oi.Order)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderItem>()
           .HasOne(oi => oi.Product)
           .WithMany() 
           .HasForeignKey(oi => oi.ProductId)
           .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            
            modelBuilder.Entity<Product>().OwnsOne(p => p.DetailDescription); 

        }
    }
}