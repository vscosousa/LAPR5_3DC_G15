using Microsoft.EntityFrameworkCore;
using DDDSample1.Domain.Patients;
using DDDSample1.Infrastructure.Patients;

namespace DDDSample1.Infrastructure
{
    public class DDDSample1DbContext : DbContext
    {
        public DDDSample1DbContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Patient> Patients { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfiguration(new PatientEntityTypeConfiguration());
        }
    }
}