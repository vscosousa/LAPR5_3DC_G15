using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.Specializations;
using DDDSample1.Infrastructure.Shared;

namespace DDDSample1.Infrastructure.Specializations
{
    internal class SpecializationEntityTypeConfiguration : IEntityTypeConfiguration<Specialization>
    {
        public void Configure(EntityTypeBuilder<Specialization> builder)
        {
            builder.HasKey(b => b.Id);
            builder.HasIndex(b => b.Id).IsUnique();
            builder.Property(b => b.Id).HasConversion(new EntityIdValueConverter<SpecializationId>());
            builder.Property(b => b.SpecOption)
                   .IsRequired()
                   .HasConversion<string>();

            
            builder
                .HasMany(b => b.Staffs)
                .WithOne(s => s.Specialization) 
                .HasForeignKey("SpecializationId") 
                .OnDelete(DeleteBehavior.Cascade); 
        }
    }
}
