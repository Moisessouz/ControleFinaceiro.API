using ControleFinaceiro.API.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<PersonEntity> Persons { get; set; }
        public DbSet<CategoryEntity> Categories { get; set; }
        public DbSet<TransactionEntity> Transactions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
            modelBuilder.Entity<PersonEntity>()
                .HasMany(p => p.Transactions)
                .WithOne(t => t.Person)
                .HasForeignKey(t => t.PersonId)
                .OnDelete(DeleteBehavior.Cascade);

            // Garantindo que o valor no banco seja sempre maior que zero no nível de BD (Check Constraint)
            modelBuilder.Entity<TransactionEntity>()
                .ToTable(t => t.HasCheckConstraint("CK_Transaction_Amount", "\"Amount\" > 0"));

            base.OnModelCreating(modelBuilder);
        }
    }
}