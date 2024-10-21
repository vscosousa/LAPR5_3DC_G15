using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Infrastructure.Shared;
using DDDSample1.Domain.Users;

namespace DDDSample1.Infrastructure.Users
{
    internal class UserEntityTypeConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(b => b.Id);
            builder.HasIndex(b => b.Id).IsUnique();
            builder.HasIndex(b => b.Email).IsUnique();
            builder.HasIndex(b => b.Username).IsUnique();
            builder.Property(b => b.Id).HasConversion(new EntityIdValueConverter<UserID>());
            builder.Property(b => b.Email).IsRequired();
            builder.Property(b => b.Username).IsRequired();
            builder.Property(b => b.PasswordHash).IsRequired();
            builder.Property(b => b.Role).IsRequired();
            builder.Property(b => b.IsActive).IsRequired();
            builder
                .HasOne(b => b.Patient)
                .WithOne()
                .HasForeignKey<User>("_patientId")
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);
            builder.HasOne(b => b.Staff)
                .WithOne()
                .HasForeignKey<User>("_staffId")
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}