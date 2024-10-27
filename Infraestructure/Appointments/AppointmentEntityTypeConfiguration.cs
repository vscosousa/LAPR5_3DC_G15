using DDDSample1.Domain.Appointments;
using Domain.Appointments;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Linq;

namespace Infrastructure.Appointments
{
    public class AppointmentEntityTypeConfiguration : IEntityTypeConfiguration<Appointment>
    {
        public void Configure(EntityTypeBuilder<Appointment> builder)
        {
            // Key
            builder.HasKey(a => a.Id);

    // Properties
    builder.Property(a => a.Id)
        .HasConversion(
            appointmentId => appointmentId.AsGuid(),
            guid => new AppointmentId(guid));

    builder.Property(a => a.Date)
        .IsRequired();

    builder.Property(a => a.RequestId)
        .IsRequired();

    builder.Property(a => a.Status)
        .IsRequired();

    builder.Property(a => a.RoomId)
        .IsRequired();

    // Many-to-many relationship with Staff
    builder.HasMany(a => a.AssignedStaff)
        .WithMany()
        .UsingEntity(j => j.ToTable("AppointmentStaff"));

    // Table name
        builder.ToTable("Appointments");
        }
    }
}   