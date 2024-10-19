using Microsoft.EntityFrameworkCore;
using DDDSample1.Domain.Patients;
using DDDSample1.Infrastructure.Patients;
using DDDSample1.Domain.User;
using DDDSample1.Domain.Specializations;
using DDDSample1.Infrastructure.Specializations;
using DDDSample1.Domain.Staffs;
using DDDSample1.Infrastructure.Staffs;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Infrastructure.OperationTypes;
using DDDSample1.Domain.Logs;
using DDDSample1.Infrastructure.Logs;

namespace DDDSample1.Infrastructure
{
    public class DDDSample1DbContext : DbContext
    {
        public DDDSample1DbContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Staff> Staffs { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Specialization> Specializations { get; set; }
        public DbSet<OperationType> OperationTypes { get; set; }
        public DbSet<Log> Logs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfiguration(new PatientEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new UserEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new StaffEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new SpecializationEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new OperationTypeEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new LogEntityTypeConfiguration());
        }

    }
}