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
            builder.HasIndex(b => b.SpecOption).IsUnique();

            builder.Property(b => b.Id).HasConversion(new EntityIdValueConverter<SpecializationId>());
            builder.Property(b => b.SpecOption).IsRequired();

            builder
                .HasMany(b => b.Staffs)
                .WithOne(s => s.Specialization) 
                .HasForeignKey("SpecializationId")
                .OnDelete(DeleteBehavior.Cascade); 

            builder
                .HasMany(b => b.OperationTypes)
                .WithMany(s => s.Specializations)
                .UsingEntity(j => j.ToTable("OperationTypeSpecialization"));
        }
    }
}
