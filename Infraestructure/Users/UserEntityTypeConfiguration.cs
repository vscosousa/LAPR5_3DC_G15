using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Infrastructure.Shared;
using DDDSample1.Domain.User;

namespace DDDSample1.Infrastructure.Patients
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
            builder.Property(b => b.IsActive).IsRequired();
            builder.Property(b => b.ActivationLinkSentAt).IsRequired(false);
        }
    }
}