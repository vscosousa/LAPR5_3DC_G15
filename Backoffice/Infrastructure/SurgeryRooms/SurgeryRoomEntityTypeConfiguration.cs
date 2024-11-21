using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DDDSample1.Infrastructure.SurgeryRooms
{
    public class SurgeryRoomEntityTypeConfiguration : IEntityTypeConfiguration<SurgeryRoom>
    {
        public void Configure(EntityTypeBuilder<SurgeryRoom> builder)
        {
            builder.HasKey(e => e.Id);
            builder.HasIndex(e => e.Id).IsUnique();
            builder.Property(e => e.Id).HasConversion(new EntityIdValueConverter<SurgeryRoomId>());
            builder.HasIndex(e => e.RoomNumber).IsUnique();
            builder.Property(e => e.RoomNumber).IsRequired().HasMaxLength(10);
            builder.Property(e => e.Type).IsRequired().HasMaxLength(10);
            builder.Property(e => e.Capacity).IsRequired();
            builder.Property(e => e.Equipment).IsRequired();
            builder.Property(e => e.Status).IsRequired();
            builder.Property(e => e.RoomMaintenance).IsRequired();
            builder.Property(e => e.AppointmentDates).IsRequired();
        }
    }
}
