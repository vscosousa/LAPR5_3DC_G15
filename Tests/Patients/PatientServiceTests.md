# Patient Tests

This document provides an overview of the tests related to the Patient Requirements. The tests are divided into three types: **Unit Tests**, **Integration Tests**, and **End-to-End Tests**.

## Summary

The following is a summary of the number of tests for each service method:

- **CreatePatient**: 3 tests
- **UpdatePatient**: 5 tests
- **DeletePatient**: 2 tests
- **SearchPatients**: 11 tests

## Table of Contents

1. [CreatePatientSuccessfullyTest](#createpatientsuccessfullytest)
2. [CreatePatientFailsDueToDuplicateEmailTest](#createpatientfailsduetoduplicateemailtest)
3. [CreatePatientFailsDueToDuplicatePhoneNumberTest](#createpatientfailsduetoduplicatephonenumbertest)
4. [UpdatePatientNamesSuccessfullyTest](#updatepatientnamessuccessfullytest)
5. [UpdatePatientContactInformationSuccessfullyTest](#updatepatientcontactinformationsuccessfullytest)
6. [UpdatePatientMedicalConditionsSuccessfullyTest](#updatepatientmedicalconditionssuccessfullytest)
7. [UpdatePatientEverythingSuccessfullyTest](#updatepatienteverythingsuccessfullytest)
8. [UpdatePatientFailsWhenPatientDoesNotExistTest](#updatepatientfailswhenpatientdoesnotexisttest)
9. [DeletePatientSucceedsWhenPatientExistsTest](#deletepatientsucceedswhenpatientexiststest)
10. [DeletePatientFailsWhenPatientDoesNotExistTest](#deletepatientfailswhenpatientdoesnotexisttest)
11. [SearchPatientsFiltersByFirstName](#searchpatientsfiltersbyfirstname)
12. [SearchPatientsFiltersByLastName](#searchpatientsfiltersbylastname)
13. [SearchPatientsFiltersByFullName](#searchpatientsfiltersbyfullname)
14. [SearchPatientsFiltersByDateOfBirth](#searchpatientsfiltersbydateofbirth)
15. [SearchPatientsFiltersByGender](#searchpatientsfiltersbygender)
16. [SearchPatientsFiltersByMedicalRecordNumber](#searchpatientsfiltersbymedicalrecordnumber)
17. [SearchPatientsFiltersByEmail](#searchpatientsfiltersbyemail)
18. [SearchPatientsFiltersByPhoneNumber](#searchpatientsfiltersbyphonenumber)
19. [SearchAllPatients](#searchallpatients)
20. [GetNullListOfPatients](#getnulllistofpatients)
21. [GetListWithMoreThanOneFilter](#getlistwithmorethanonefilter)

## Test Descriptions

### CreatePatientSuccessfullyTest

| **Purpose** | To verify that a patient can be created successfully. |
|-------------|-------------------------------------------------------|
| **Expected Result** | The patient is created and all properties match the expected values. |
| **Type of Test** | Unit Test |

### CreatePatientFailsDueToDuplicateEmailTest

| **Purpose** | To verify that creating a patient fails if the email already exists. |
|-------------|---------------------------------------------------------------------|
| **Expected Result** | A `BusinessRuleValidationException` is thrown. |
| **Type of Test** | Unit Test |

### CreatePatientFailsDueToDuplicatePhoneNumberTest

| **Purpose** | To verify that creating a patient fails if the phone number already exists. |
|-------------|--------------------------------------------------------------------------|
| **Expected Result** | A `BusinessRuleValidationException` is thrown. |
| **Type of Test** | Unit Test |

### UpdatePatientNamesSuccessfullyTest

| **Purpose** | To verify that a patient's name can be updated successfully. |
|-------------|--------------------------------------------------------------|
| **Expected Result** | The patient's name is updated and a log entry is created. |
| **Type of Test** | Unit Test |

### UpdatePatientContactInformationSuccessfullyTest

| **Purpose** | To verify that a patient's contact information can be updated successfully. |
|-------------|---------------------------------------------------------------------------|
| **Expected Result** | The patient's contact information is updated and a log entry is created. |
| **Type of Test** | Unit Test |

### UpdatePatientMedicalConditionsSuccessfullyTest

| **Purpose** | To verify that a patient's medical conditions can be updated successfully. |
|-------------|---------------------------------------------------------------------------|
| **Expected Result** | The patient's medical conditions are updated and a log entry is created. |
| **Type of Test** | Unit Test |

### UpdatePatientEverythingSuccessfullyTest

| **Purpose** | To verify that all patient details can be updated successfully. |
|-------------|-----------------------------------------------------------------|
| **Expected Result** | The patient's details are updated and a log entry is created. |
| **Type of Test** | Unit Test |

### UpdatePatientFailsWhenPatientDoesNotExistTest

| **Purpose** | To verify that updating a patient fails if the patient does not exist. |
|-------------|-----------------------------------------------------------------------|
| **Expected Result** | The result is `null`. |
| **Type of Test** | Unit Test |

### DeletePatientSucceedsWhenPatientExistsTest

| **Purpose** | To verify that a patient can be deleted successfully. |
|-------------|-------------------------------------------------------|
| **Expected Result** | The patient is deleted and a log entry is created. |
| **Type of Test** | Unit Test |

### DeletePatientFailsWhenPatientDoesNotExistTest

| **Purpose** | To verify that deleting a patient fails if the patient does not exist. |
|-------------|-----------------------------------------------------------------------|
| **Expected Result** | The result is `null`. |
| **Type of Test** | Unit Test |

### SearchPatientsFiltersByFirstName

| **Purpose** | To verify that patients can be searched by first name. |
|-------------|--------------------------------------------------------|
| **Expected Result** | The result contains patients with the specified first name. |
| **Type of Test** | Unit Test |

### SearchPatientsFiltersByLastName

| **Purpose** | To verify that patients can be searched by last name. |
|-------------|-------------------------------------------------------|
| **Expected Result** | The result contains patients with the specified last name. |
| **Type of Test** | Unit Test |

### SearchPatientsFiltersByFullName

| **Purpose** | To verify that patients can be searched by full name. |
|-------------|-------------------------------------------------------|
| **Expected Result** | The result contains patients with the specified full name. |
| **Type of Test** | Unit Test |

### SearchPatientsFiltersByDateOfBirth

| **Purpose** | To verify that patients can be searched by date of birth. |
|-------------|-----------------------------------------------------------|
| **Expected Result** | The result contains patients with the specified date of birth. |
| **Type of Test** | Unit Test |

### SearchPatientsFiltersByGender

| **Purpose** | To verify that patients can be searched by gender. |
|-------------|----------------------------------------------------|
| **Expected Result** | The result contains patients with the specified gender. |
| **Type of Test** | Unit Test |

### SearchPatientsFiltersByMedicalRecordNumber

| **Purpose** | To verify that patients can be searched by medical record number. |
|-------------|------------------------------------------------------------------|
| **Expected Result** | The result contains patients with the specified medical record number. |
| **Type of Test** | Unit Test |

### SearchPatientsFiltersByEmail

| **Purpose** | To verify that patients can be searched by email. |
|-------------|---------------------------------------------------|
| **Expected Result** | The result contains patients with the specified email. |
| **Type of Test** | Unit Test |

### SearchPatientsFiltersByPhoneNumber

| **Purpose** | To verify that patients can be searched by phone number. |
|-------------|----------------------------------------------------------|
| **Expected Result** | The result contains patients with the specified phone number. |
| **Type of Test** | Unit Test |

### SearchAllPatients

| **Purpose** | To verify that all patients can be searched without any filters. |
|-------------|-----------------------------------------------------------------|
| **Expected Result** | The result contains all patients. |
| **Type of Test** | Unit Test |

### GetNullListOfPatients

| **Purpose** | To verify that searching for patients with non-matching criteria returns `null`. |
|-------------|---------------------------------------------------------------------------------|
| **Expected Result** | The result is `null`. |
| **Type of Test** | Unit Test |

### GetListWithMoreThanOneFilter

| **Purpose** | To verify that patients can be searched using multiple filters. |
|-------------|-----------------------------------------------------------------|
| **Expected Result** | The result contains patients matching all specified filters. |
| **Type of Test** | Unit Test |

---
<br>

[Back to top](#patient-tests)