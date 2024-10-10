using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.Staffs;
using DDDSample1.Infrastructure.Shared;
using DDDSample1.Domain.Specializations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Infrastructure.Staffs
{
    internal class StaffEntityTypeConfiguration : IEntityTypeConfiguration<Staff>
    {
        public void Configure(EntityTypeBuilder<Staff> builder)
        {
            builder.HasKey(b => b.Id);
            builder.HasIndex(b => b.Id).IsUnique();
            builder.HasIndex(b => b.Email).IsUnique();
            builder.HasIndex(b => b.PhoneNumber).IsUnique();
            builder.HasIndex(b => b.LicenseNumber).IsUnique();
            
            builder.Property(b => b.Id).HasConversion(new EntityIdValueConverter<StaffId>());  
            builder.Property(b => b.FirstName).IsRequired(); 
            builder.Property(b => b.LastName).IsRequired();          
            builder.Property(b => b.FullName).IsRequired();          
            builder.Property(b => b.Email).IsRequired();
            builder.Property(b => b.PhoneNumber).IsRequired(); 
            //builder.HasMany(b => b.Specialization).WithOne().OnDelet chave estrangueira
            builder.Property(b => b.LicenseNumber).IsRequired(); 
            builder.Property(b => b.AvailabilitySlots).IsRequired(); 
        }
    }
}
