using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.Appointments;
using DDDSample1.Infrastructure.Shared;

namespace DDDSample1.Infrastructure.Appointments
{
    internal class AppointmentsEntityTypeConfiguration : IEntityTypeConfiguration<Appointment>
    {
        public void Configure(EntityTypeBuilder<Appointment> builder)
        {
            builder.HasKey(e => e.Id);
            builder.HasIndex(e => e.Id).IsUnique();
            builder.Property(e => e.Id).HasConversion(new EntityIdValueConverter<AppointmentId>());
            builder.Property(e => e.DateTime).IsRequired();
            builder.Property(e => e.Status).IsRequired();

            builder
                .HasOne(b => b.Request)
                .WithOne()
                .HasForeignKey<Appointment>("_requestId")
                .IsRequired(true)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .HasOne(b => b.Room)
                .WithOne()
                .HasForeignKey<Appointment>("_roomId")
                .IsRequired(true)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}