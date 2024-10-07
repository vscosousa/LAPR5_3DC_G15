using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.Patients;
using DDDSample1.Infrastructure.Shared;
using DDDSample1.Domain.ValueObjects;

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
            builder.Property(b => b.Id).HasConversion(new EntityIdValueConverter<PatientId>());
            builder.Property(b => b.FirstName).IsRequired().HasConversion(new ValueObjectConverter<Name>());
            builder.Property(b => b.LastName).IsRequired().HasConversion(new ValueObjectConverter<Name>());
            builder.Property(b => b.FullName).IsRequired().HasConversion(new ValueObjectConverter<FullName>());
            builder.Property(b => b.DateOfBirth).IsRequired().HasConversion(new ValueObjectConverter<Date>());
            builder.Property(b => b.Email).IsRequired().HasConversion(new ValueObjectConverter<Email>());
            builder.Property(b => b.PhoneNumber).IsRequired().HasConversion(new ValueObjectConverter<PhoneNumber>());
            builder.Property(b => b.EmergencyContact).IsRequired().HasConversion(new ValueObjectConverter<EmergencyContact>());
            builder.Property(b => b.MedicalConditions).IsRequired().HasConversion(new ValueObjectConverter<MedicalConditions>());
            builder.Property(b => b.AppointmentHistory).IsRequired().HasConversion(new ValueObjectConverter<AppointmentHistory>());
        }
    }
}