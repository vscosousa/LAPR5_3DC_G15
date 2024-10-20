using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.Patients;
using DDDSample1.Infrastructure.Shared;

namespace DDDSample1.Infrastructure.Patients
{
    internal class PatientEntityTypeConfiguration : IEntityTypeConfiguration<Patient>
    {
        public void Configure(EntityTypeBuilder<Patient> builder)
        {
            builder.HasKey(b => b.Id);
            builder.HasIndex(b => b.Id).IsUnique();
            builder.HasIndex(b => b.Email).IsUnique();
            builder.HasIndex(b => b.PhoneNumber).IsUnique();
            builder.HasIndex(b => b.MedicalRecordNumber).IsUnique();
            builder.Property(b => b.Id).HasConversion(new EntityIdValueConverter<PatientId>());
            builder.Property(b => b.FirstName).IsRequired();
            builder.Property(b => b.LastName).IsRequired();
            builder.Property(b => b.FullName).IsRequired();
            builder.Property(b => b.DateOfBirth).IsRequired();
            builder.Property(b => b.GenderOptions).IsRequired().HasConversion<string>().HasField("_genderOptions"); 
            builder.Property(b => b.MedicalRecordNumber).IsRequired();
            builder.Property(b => b.Email).IsRequired();
            builder.Property(b => b.PhoneNumber).IsRequired();
            builder.Property(b => b.EmergencyContact).IsRequired();
            builder.Property(b => b.MedicalConditions).IsRequired(false);
            builder.Property(b => b.AppointmentHistory).IsRequired();
            builder.Property(b => b.IsActive).IsRequired();
        }
    }
}