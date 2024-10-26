using System;
using System.Linq;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.Staffs;
using Xunit;

namespace DDDSample1.Tests.Staffs.UnitTests
{
    public class StaffTests
    {
        [Fact]
        public void Constructor_ValidInputs_ShouldCreateStaff()
        {
            // Arrange
            var firstName = "Test";
            var lastName = "Afonso";
            var fullName = "Test Afonso";
            var email = "test@example.com";
            var phoneNumber = "+351923456789";
            var specializationId = new SpecializationId(Guid.NewGuid());

            // Act
            var staff = new Staff(firstName, lastName, fullName, email, phoneNumber, specializationId);

            // Assert
            Assert.Equal(firstName, staff.FirstName);
            Assert.Equal(lastName, staff.LastName);
            Assert.Equal(fullName, staff.FullName);
            Assert.Equal(email, staff.Email);
            Assert.Equal(phoneNumber, staff.PhoneNumber);
            Assert.Equal(specializationId, staff.SpecializationId);
            Assert.True(staff.IsActive);
        }

        [Fact]
        public void Constructor_InvalidEmail_ShouldThrowArgumentException()
        {
            // Arrange
            var firstName = "Test";
            var lastName = "Afonso";
            var fullName = "Test Afonso";
            var email = "invalid-email";
            var phoneNumber = "+351923456789";
            var specializationId = new SpecializationId(Guid.NewGuid());

            // Act & Assert
            Assert.Throws<ArgumentException>(() => new Staff(firstName, lastName, fullName, email, phoneNumber, specializationId));
        }

        [Fact]
        public void Constructor_InvalidPhoneNumber_ShouldThrowArgumentException()
        {
            var firstName = "Test";
            var lastName = "Afonso";
            var fullName = "Test Afonso";
            var email = "test@example.com";
            var phoneNumber = "351923456789";
            var specializationId = new SpecializationId(Guid.NewGuid());

            // Act & Assert
            Assert.Throws<ArgumentException>(() => new Staff(firstName, lastName, fullName, email, phoneNumber, specializationId));
        }

        [Fact]
        public void Deactivate_ActiveStaff_ShouldDeactivate()
        {
            // Arrange
            var staff = new Staff("Test", "Afonso", "Test Afonso", "test@example.com", "+351923456789", new SpecializationId(Guid.NewGuid()));

            // Act
            staff.Deactivate();

            // Assert
            Assert.False(staff.IsActive);
        }

        [Fact]
        public void Deactivate_AlreadyDeactivatedStaff_ShouldThrowException()
        {
            // Arrange
            var staff = new Staff("Test", "Afonso", "Test Afonso", "test@example.com", "+351923456789", new SpecializationId(Guid.NewGuid()));
            staff.Deactivate();

            // Act & Assert
            Assert.Throws<BusinessRuleValidationException>(() => staff.Deactivate());
        }

        [Fact]
        public void ChangePhoneNumber_ValidPhoneNumber_ShouldChangePhoneNumber()
        {
            // Arrange
            var staff = new Staff("Test", "Afonso", "Test Afonso", "test@example.com", "+351923456789", new SpecializationId(Guid.NewGuid()));
            var newPhoneNumber = "+351987654321";

            // Act
            staff.ChangePhoneNumber(newPhoneNumber);

            // Assert
            Assert.Equal(newPhoneNumber, staff.PhoneNumber);
        }

        [Fact]
        public void ChangePhoneNumber_InvalidPhoneNumber_ShouldThrowException()
        {
            // Arrange
            var staff = new Staff("Test", "Afonso", "Test Afonso", "test@example.com", "+351923456789", new SpecializationId(Guid.NewGuid()));
            var invalidPhoneNumber = "987654321"; 

            // Act & Assert
            Assert.Throws<ArgumentException>(() => staff.ChangePhoneNumber(invalidPhoneNumber));
        }

        [Fact]
        public void ChangeEmail_ValidEmail_ShouldChangeEmail()
        {
            // Arrange
            var staff = new Staff("Test", "Afonso", "Test Afonso", "test@example.com", "+351923456789", new SpecializationId(Guid.NewGuid()));
            var newEmail = "newemail@example.com";

            // Act
            staff.ChangeEmail(newEmail);

            // Assert
            Assert.Equal(newEmail, staff.Email);
        }

        [Fact]
        public void ChangeEmail_InvalidEmail_ShouldThrowException()
        {
            // Arrange
            var staff = new Staff("Test", "Afonso", "Test Afonso", "test@example.com", "+351923456789", new SpecializationId(Guid.NewGuid()));
            var invalidEmail = "invalid-email";

            // Act & Assert
            Assert.Throws<ArgumentException>(() => staff.ChangeEmail(invalidEmail));
        }

        [Fact]
        public void AddAvailabilitySlot_ValidSlot_ShouldAddSlot()
        {
            // Arrange
            var staff = new Staff("Test", "Afonso", "Test Afonso", "test@example.com", "+351923456789", new SpecializationId(Guid.NewGuid()));
            var newSlot = new DateTime(2025, 10, 10, 10, 0, 0);

            // Act
            staff.AddAvailabilitySlot(newSlot);

            // Assert
            Assert.Contains(newSlot, staff.AvailabilitySlots);
        }

        [Fact]
        public void AddAvailabilitySlot_InvalidFormat_ShouldThrowException()
        {
            // Arrange
            var staff = new Staff("Test", "Afonso", "Test Afonso", "test@example.com", "+351923456789", new SpecializationId(Guid.NewGuid()));
            var invalidSlot = new DateTime(2023, 10, 10, 10, 0, 0);

            // Act & Assert
            Assert.Throws<BusinessRuleValidationException>(() => staff.AddAvailabilitySlot(invalidSlot));
        }

        [Fact]
        public void AddAvailabilitySlot_ExistingSlot_ShouldThrowException()
        {
            // Arrange
            var staff = new Staff("Test", "Afonso", "Test Afonso", "test@example.com", "+351923456789", new SpecializationId(Guid.NewGuid()));
            var existingSlot = new DateTime(2025, 10, 10, 10, 0, 0);
            staff.AddAvailabilitySlot(existingSlot);

            // Act & Assert
            Assert.Throws<BusinessRuleValidationException>(() => staff.AddAvailabilitySlot(existingSlot));
        }

        [Fact]
        public void AddAvailabilitySlot_PastSlot_ShouldThrowException()
        {
            // Arrange
            var staff = new Staff("Test", "Afonso", "Test Afonso", "test@example.com", "+351923456789", new SpecializationId(Guid.NewGuid()));
            var pastSlot = new DateTime(2020, 10, 10, 10, 0, 0);

            // Act & Assert
            Assert.Throws<BusinessRuleValidationException>(() => staff.AddAvailabilitySlot(pastSlot));
        }

        [Fact]
        public void RemoveAvailabilitySlot_ExistingSlot_ShouldRemoveSlot()
        {
            // Arrange
            var staff = new Staff("Test", "Afonso", "Test Afonso", "test@example.com", "+351923456789", new SpecializationId(Guid.NewGuid()));
            var existingSlot = new DateTime(2025, 10, 10, 10, 0, 0);
            staff.AddAvailabilitySlot(existingSlot);

            // Act
            staff.RemoveAvailabilitySlot(existingSlot);

            // Assert
            Assert.DoesNotContain(existingSlot, staff.AvailabilitySlots);
        }

        [Fact]
        public void RemoveAvailabilitySlot_NonExistingSlot_ShouldThrowException()
        {
            // Arrange
            var staff = new Staff("Test", "Afonso", "Test Afonso", "test@example.com", "+351923456789", new SpecializationId(Guid.NewGuid()));
            var nonExistingSlot = new DateTime(2023, 10, 10, 10, 0, 0);

            // Act & Assert
            Assert.Throws<BusinessRuleValidationException>(() => staff.RemoveAvailabilitySlot(nonExistingSlot));
        }

        [Fact]
        public void ChangeSpecializationId_ValidSpecializationId_ShouldChangeSpecializationId()
        {
            // Arrange
            var staff = new Staff("Test", "Afonso", "Test Afonso", "test@example.com", "+351923456789", new SpecializationId(Guid.NewGuid()));
            var newSpecializationId = new SpecializationId(Guid.NewGuid());

            // Act
            staff.ChangeSpecializationId(newSpecializationId);

            // Assert
            Assert.Equal(newSpecializationId, staff.SpecializationId);
        }

        [Fact]
        public void ChangeSpecializationId_NullSpecializationId_ShouldThrowException()
        {
            // Arrange
            var staff = new Staff("Test", "Afonso", "Test Afonso", "test@example.com", "+351923456789", new SpecializationId(Guid.NewGuid()));

            // Act & Assert
            Assert.Throws<ArgumentException>(() => staff.ChangeSpecializationId(null));
        }
    }
}