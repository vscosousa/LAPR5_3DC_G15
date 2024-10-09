using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Infrastructure.Shared;
using DDDSample1.Domain.OperationTypes;

namespace DDDSample1.Infrastructure.OperationTypes
{

    internal class OperationTypeEntityTypeConfiguration : IEntityTypeConfiguration<OperationType>
    {
        public void Configure(EntityTypeBuilder<OperationType> builder)
        {
            builder.HasKey(b => b.Id);
            builder.HasIndex(b => b.Id).IsUnique();
            builder.Property(b => b.Id).HasConversion(new EntityIdValueConverter<OperationTypeId>());
            builder.Property(b => b.Name).IsRequired().HasConversion(new ValueObjectConverter<Name>());
            builder.Property(b => b.EstimatedDuration).IsRequired().HasConversion(new ValueObjectConverter<EstimatedDuration>());
        }
    }
}