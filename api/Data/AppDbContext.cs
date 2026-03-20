using api_asp.Models;
using Microsoft.EntityFrameworkCore;

namespace api_asp.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<Deputado> Deputados { get; set; }
        public DbSet<Despesa> Despesas { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Despesa>()
                .HasOne(d => d.Deputado)
                .WithMany(p => p.Despesas) 
                .HasForeignKey(d => d.DeputadoId) 
                .OnDelete(DeleteBehavior.Cascade); 
        }


    }

}
