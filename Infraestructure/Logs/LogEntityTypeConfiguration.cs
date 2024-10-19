using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.Logs;
using DDDSample1.Infrastructure.Shared;

namespace DDDSample1.Infrastructure.Logs
{
    internal class LogEntityTypeConfiguration : IEntityTypeConfiguration<Log>
    {
        public void Configure(EntityTypeBuilder<Log> builder)
        {
            builder.HasKey(b => b.Id);
            builder.HasIndex(b => b.Id).IsUnique();
            builder.Property(b => b.Id).HasConversion(new EntityIdValueConverter<LogId>());
            builder.Property(b => b.TypeOfAction).IsRequired().HasConversion<string>().HasField("_typeOfAction");
            builder.Property(b => b.EntityId).IsRequired();
            builder.Property(b => b.DateTime).IsRequired();
            builder.Property(b => b.Message).IsRequired();
        }
    }
}