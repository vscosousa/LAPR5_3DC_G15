using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Infrastructure.Shared;

namespace DDDSample1.Infrastructure.OperationRequests
{
    internal class OperationRequestsEntityTypeConfiguration : IEntityTypeConfiguration<OperationRequest>
    {
        public void Configure(EntityTypeBuilder<OperationRequest> builder)
        {
            builder.HasKey(e => e.Id);
            builder.HasIndex(e => e.Id).IsUnique();
            builder.Property(e => e.Id).HasConversion(new EntityIdValueConverter<OperationRequestId>());
            builder.Property(e => e.DeadlineDate).IsRequired();
            builder.Property(e => e.Priority).IsRequired();
            builder.Property(e => e.Status).IsRequired();
            

            builder
                .HasOne(b => b.Patient)
                .WithMany()
                .HasForeignKey("_patientId")
                .IsRequired(true)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .HasOne(b => b.Doctor)
                .WithMany()
                .HasForeignKey("_doctorId")
                .IsRequired(true)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .HasOne(b => b.OperationType)
                .WithMany()
                .HasForeignKey("_operationTypeId")
                .IsRequired(true)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}