using System;
using Xunit;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.Patients
{
    public class PatientTests
    {
        [Fact]
        public void CreatePatientDirectlyFromDomainSuccessfully()
        {
            var firstName = "Carlos";
            var lastName = "Silva";
            var fullName = "Carlos Silva";
            var dateOfBirth = new DateOnly(1985, 5, 15);
            var gender = GenderOptions.Male;
            var email = "carlos.silva@example.com";
            var phoneNumber = "+351912345678";
            var emergencyContact = "+351987654321";
            var medicalConditions = "Nenhuma";

            var patient = new Patient(firstName, lastName, fullName, dateOfBirth, gender, email, phoneNumber, emergencyContact, medicalConditions);

            Assert.Equal(firstName, patient.FirstName);
            Assert.Equal(lastName, patient.LastName);
            Assert.Equal(fullName, patient.FullName);
            Assert.Equal(dateOfBirth, patient.DateOfBirth);
            Assert.Equal(gender, patient.GenderOptions);
            Assert.Equal(email, patient.Email);
            Assert.Equal(phoneNumber, patient.PhoneNumber);
            Assert.Equal(emergencyContact, patient.EmergencyContact);
            Assert.Equal(medicalConditions, patient.MedicalConditions);
            Assert.True(patient.IsActive);
        }

        [Fact]
        public void CreatePatientDirectlyFromDomainWithInvalidFirstName()
        {
            var firstName = "carlos";
            var lastName = "Silva";
            var fullName = "Carlos Silva";
            var dateOfBirth = new DateOnly(1985, 5, 15);
            var gender = GenderOptions.Male;
            var email = "carlos.silva@example.com";
            var phoneNumber = "+351912345678";
            var emergencyContact = "+351987654321";
            var medicalConditions = "Nenhuma";

            Assert.Throws<BusinessRuleValidationException>(() => new Patient(firstName, lastName, fullName, dateOfBirth, gender, email, phoneNumber, emergencyContact, medicalConditions));
        }

        [Fact]
        public void CreatePatientDirectlyFromDomainWithInvalidLastName()
        {
            var firstName = "Carlos";
            var lastName = "silva";
            var fullName = "Carlos Silva";
            var dateOfBirth = new DateOnly(1985, 5, 15);
            var gender = GenderOptions.Male;
            var email = "carlos.silva@example.com";
            var phoneNumber = "+351912345678";
            var emergencyContact = "+351987654321";
            var medicalConditions = "Nenhuma";

            Assert.Throws<BusinessRuleValidationException>(() => new Patient(firstName, lastName, fullName, dateOfBirth, gender, email, phoneNumber, emergencyContact, medicalConditions));
        }

        [Fact]
        public void CreatePatientDirectlyFromDomainWithInvalidFullName()
        {
            var firstName = "Carlos";
            var lastName = "Silva";
            var fullName = "carlos silva";
            var dateOfBirth = new DateOnly(1985, 5, 15);
            var gender = GenderOptions.Male;
            var email = "carlos.silva@example.com";
            var phoneNumber = "+351912345678";
            var emergencyContact = "+351987654321";
            var medicalConditions = "Nenhuma";

            Assert.Throws<BusinessRuleValidationException>(() => new Patient(firstName, lastName, fullName, dateOfBirth, gender, email, phoneNumber, emergencyContact, medicalConditions));
        }

        [Fact]
        public void CreatePatientDirectlyFromDomainWithInvalidDateOfBirth()
        {
            var firstName = "Carlos";
            var lastName = "Silva";
            var fullName = "Carlos Silva";
            var dateOfBirth = new DateOnly(2025, 1, 1);
            var gender = GenderOptions.Male;
            var email = "carlos.silva@example.com";
            var phoneNumber = "+351912345678";
            var emergencyContact = "+351987654321";
            var medicalConditions = "Nenhuma";

            Assert.Throws<BusinessRuleValidationException>(() => new Patient(firstName, lastName, fullName, dateOfBirth, gender, email, phoneNumber, emergencyContact, medicalConditions));
        }

        [Fact]
        public void CreatePatientDirectlyFromDomainWithInvalidGender()
        {
            var firstName = "Carlos";
            var lastName = "Silva";
            var fullName = "Carlos Silva";
            var dateOfBirth = new DateOnly(1985, 5, 15);
            var gender = (GenderOptions)3;
            var email = "carlos.silva@example.com";
            var phoneNumber = "+351912345678";
            var emergencyContact = "+351987654321";
            var medicalConditions = "Nenhuma";

            Assert.Throws<BusinessRuleValidationException>(() => new Patient(firstName, lastName, fullName, dateOfBirth, gender, email, phoneNumber, emergencyContact, medicalConditions));
        }


        [Fact]
        public void CreatePatientDirectlyFromDomainWithInvalidEmail()
        {
            var firstName = "Carlos";
            var lastName = "Silva";
            var fullName = "Carlos Silva";
            var dateOfBirth = new DateOnly(1985, 5, 15);
            var gender = GenderOptions.Male;
            var email = "email-invalido";
            var phoneNumber = "+351912345678";
            var emergencyContact = "+351987654321";
            var medicalConditions = "Nenhuma";

            Assert.Throws<BusinessRuleValidationException>(() => new Patient(firstName, lastName, fullName, dateOfBirth, gender, email, phoneNumber, emergencyContact, medicalConditions));
        }

        [Fact]
        public void CreatePatientDirectlyFromDomainWithInvalidPhoneNumber()
        {
            var firstName = "Carlos";
            var lastName = "Silva";
            var fullName = "Carlos Silva";
            var dateOfBirth = new DateOnly(1985, 5, 15);
            var gender = GenderOptions.Male;
            var email = "carlos.silva@example.com";
            var phoneNumber = "912345678";
            var emergencyContact = "+351987654321";
            var medicalConditions = "Nenhuma";

            Assert.Throws<BusinessRuleValidationException>(() => new Patient(firstName, lastName, fullName, dateOfBirth, gender, email, phoneNumber, emergencyContact, medicalConditions));
        }

        [Fact]
        public void CreatePatientDirectlyFromDomainWithInvalidEmergencyContact()
        {
            var firstName = "Carlos";
            var lastName = "Silva";
            var fullName = "Carlos Silva";
            var dateOfBirth = new DateOnly(1985, 5, 15);
            var gender = GenderOptions.Male;
            var email = "carlos.silva@example.com";
            var phoneNumber = "+351912345678";
            var emergencyContact = "987654321";
            var medicalConditions = "Nenhuma";

            Assert.Throws<BusinessRuleValidationException>(() => new Patient(firstName, lastName, fullName, dateOfBirth, gender, email, phoneNumber, emergencyContact, medicalConditions));
        }

        [Fact]
        public void ChangeFirstNameDirectlyFromDomainSuccessfully()
        {
            var patient = new Patient("Carlos", "Silva", "Carlos Silva", new DateOnly(1985, 5, 15), GenderOptions.Male, "carlos.silva@example.com", "+351912345678", "+351987654321", "Nenhuma");
            var newFirstName = "João";

            patient.ChangeFirstName(newFirstName);

            Assert.Equal(newFirstName, patient.FirstName);
        }

        [Fact]
        public void ChangeLastNameDirectlyFromDomainSuccessfully()
        {
            var patient = new Patient("Carlos", "Silva", "Carlos Silva", new DateOnly(1985, 5, 15), GenderOptions.Male, "carlos.silva@example.com", "+351912345678", "+351987654321", "Nenhuma");
            var newLastName = "Santos";

            patient.ChangeLastName(newLastName);

            Assert.Equal(newLastName, patient.LastName);
        }

        [Fact]
        public void ChangeFullNameDirectlyFromDomainSuccessfully()
        {
            var patient = new Patient("Carlos", "Silva", "Carlos Silva", new DateOnly(1985, 5, 15), GenderOptions.Male, "carlos.silva@example.com", "+351912345678", "+351987654321", "Nenhuma");
            var newFullName = "João Santos";

            patient.ChangeFullName(newFullName);

            Assert.Equal(newFullName, patient.FullName);
        }

        [Fact]
        public void ChangeEmailDirectlyFromDomainSuccessfully()
        {
            var patient = new Patient("Carlos", "Silva", "Carlos Silva", new DateOnly(1985, 5, 15), GenderOptions.Male, "carlos.silva@example.com", "+351912345678", "+351987654321", "Nenhuma");
            var newEmail = "novo.email@example.com";

            patient.ChangeEmail(newEmail);

            Assert.Equal(newEmail, patient.Email);
        }

        [Fact]
        public void ChangeEmailDirectlyFromDomainWithInvalidEmail()
        {
            var patient = new Patient("Carlos", "Silva", "Carlos Silva", new DateOnly(1985, 5, 15), GenderOptions.Male, "carlos.silva@example.com", "+351912345678", "+351987654321", "Nenhuma");
            var invalidEmail = "email-invalido";

            Assert.Throws<ArgumentException>(() => patient.ChangeEmail(invalidEmail));
        }

        [Fact]
        public void ChangePhoneNumberDirectlyFromDomainSuccessfully()
        {
            var patient = new Patient("Carlos", "Silva", "Carlos Silva", new DateOnly(1985, 5, 15), GenderOptions.Male, "carlos.silva@example.com", "+351912345678", "+351987654321", "Nenhuma");
            var newPhoneNumber = "+351911234567";

            patient.ChangePhoneNumber(newPhoneNumber);

            Assert.Equal(newPhoneNumber, patient.PhoneNumber);
        }

        [Fact]
        public void ChangePhoneNumberDirectlyFromDomainWithInvalidPhoneNumber()
        {
            var patient = new Patient("Carlos", "Silva", "Carlos Silva", new DateOnly(1985, 5, 15), GenderOptions.Male, "carlos.silva@example.com", "+351912345678", "+351987654321", "Nenhuma");
            var invalidPhoneNumber = "912345678";

            Assert.Throws<BusinessRuleValidationException>(() => patient.ChangePhoneNumber(invalidPhoneNumber));
        }

        [Fact]
        public void ChangeEmergencyContactDirectlyFromDomainSuccessfully()
        {
            var patient = new Patient("Carlos", "Silva", "Carlos Silva", new DateOnly(1985, 5, 15), GenderOptions.Male, "carlos.silva@example.com", "+351912345678", "+351987654321", "Nenhuma");
            var newEmergencyContact = "+351911234567";

            patient.ChangeEmergencyContact(newEmergencyContact);

            Assert.Equal(newEmergencyContact, patient.EmergencyContact);
        }

        [Fact]
        public void ChangeEmergencyContactDirectlyFromDomainWithInvalidEmergencyContact()
        {
            var patient = new Patient("Carlos", "Silva", "Carlos Silva", new DateOnly(1985, 5, 15), GenderOptions.Male, "carlos.silva@example.com", "+351912345678", "+351987654321", "Nenhuma");
            var invalidEmergencyContact = "911234567";

            Assert.Throws<BusinessRuleValidationException>(() => patient.ChangeEmergencyContact(invalidEmergencyContact));
        }

        [Fact]
        public void ChangeMedicalConditionsDirectlyFromDomainSuccessfully()
        {
            var patient = new Patient("Carlos", "Silva", "Carlos Silva", new DateOnly(1985, 5, 15), GenderOptions.Male, "carlos.silva@example.com", "+351912345678", "+351987654321", "Nenhuma");
            var newMedicalConditions = "Diabetes";

            patient.ChangeMedicalConditions(newMedicalConditions);

            Assert.Equal(newMedicalConditions, patient.MedicalConditions);
        }
    }
}
