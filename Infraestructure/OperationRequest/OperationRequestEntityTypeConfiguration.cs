using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Infrastructure.Shared;
using DDDSample1.Domain.OperationRequests;

namespace DDDSample1.Infrastructure.OperationRequests
{
    internal class OperationRequestEntityTypeConfiguration : IEntityTypeConfiguration<OperationRequest>
{
    public void Configure(EntityTypeBuilder<OperationRequest> builder)
    {
        // Key and basic properties
        builder.HasKey(b => b.Id);
        builder.Property(b => b.Id)
            .HasConversion(new EntityIdValueConverter<OperationRequestId>());
        builder.Property(b => b.CreatedAt).IsRequired();
        builder.Property(b => b.Status).IsRequired();
        
        // Relationships - using navigation properties
        builder.HasOne(b => b.PatientId)  // Changed from PatientId to Patient
            .WithMany()
            .HasForeignKey("PatientId")
            .IsRequired();

        builder.HasOne(b => b.StaffId)    // Changed from StaffId to Staff
            .WithMany()
            .HasForeignKey("StaffId")
            .IsRequired();

        builder.HasOne(b => b.OperationTypeId)    // Changed from OperationTypeId to OperationType
            .WithMany()
            .HasForeignKey("OperationTypeId")
            .IsRequired();

        builder.ToTable("OperationRequests");
        }
    }
}
