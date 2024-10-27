using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.SurgeryRooms;

namespace Infrastructure.SurgeryRooms
{
    public class SurgeryRoomEntityTypeConfiguration : IEntityTypeConfiguration<SurgeryRoom>
    {
        public void Configure(EntityTypeBuilder<SurgeryRoom> builder)
        {
        builder.Property(b => b.Id)
        .HasConversion(
            surgeryRoomId => surgeryRoomId.AsGuid(),
            guid => new SurgeryRoomId(guid));
        
        builder.Property(b => b.Number)
            .IsRequired();

        builder.Property(b => b.Type)
            .IsRequired();

        builder.Property(b => b.Capacity)
            .IsRequired();

        builder.Property(b => b.Status)
            .IsRequired();

        builder.OwnsMany(b => b.AssignedEquipment);
        
        builder.OwnsMany(b => b.MaintenanceSlots);
        }
    }
}