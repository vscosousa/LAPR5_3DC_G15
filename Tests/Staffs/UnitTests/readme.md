# Staff Service Tests

This document provides an overview of the tests related to the Staff. The tests are divided into three types: **Unit Tests**,and **Domain Tests**.

## Summary

The following is a summary of the number of tests for each service method:

- **CreateStaffAsync**: 4 tests
- **DeactivateStaffAsync**: 3 tests
- **UpdateStaffAsync**: 7 tests
- **SearchStaffProfiles**: 5 tests
- **Staff Domain Tests**: 14 tests

## Table of Contents

1. [CreateStaffAsyncSuccessfullyTest](#createstaffasyncsuccessfullytest)
2. [CreateStaffFailsDueToDuplicatePhoneNumberTest](#createstafffailsduetoduplicatephonenumbertest)
3. [CreateStaffFailsDueToDuplicateEmailTest](#createstafffailsduetoduplicateemailtest)
4. [CreateStaffFailsDueToSpecializationNotFoundTest](#createstafffailsduetospecializationnotfoundtest)
5. [DeactivateStaffAsyncSuccessfullyTest](#deactivatestaffasyncsuccessfullytest)
6. [DeactivateStaffAsyncFailsStaffAlreadyDeactivatedTest](#deactivatestaffasyncfailsstaffalreadydeactivatedtest)
7. [DeactivateStaffAsyncFailsStaffNotFoundTest](#deactivatestaffasyncfailsstaffnotfoundtest)
8. [UpdateStaffAsyncSuccessfullyUpdatesStaff](#updatestaffasyncsuccessfullyupdatesstaff)
9. [UpdateStaffAsyncStaffNotFoundReturnsNull](#updatestaffasyncstaffnotfoundreturnsnull)
10. [UpdateStaffAsyncPhoneNumberAlreadyInUseThrowsException](#updatestaffasyncphonenumberalreadyinusethrowsexception)
11. [UpdateStaffAsyncEmailAlreadyInUseThrowsException](#updatestaffasyncemailalreadyinusethrowsexception)
12. [UpdateStaffAsyncAddAvailabilitySlotsInvalidFormatThrowsException](#updatestaffasyncaddavailabilityslotsinvalidformatthrowsexception)
13. [UpdateStaffAsyncRemoveAvailabilitySlotsInvalidFormatThrowsException](#updatestaffasyncremoveavailabilityslotsinvalidformatthrowsexception)
14. [UpdateStaffAsyncSpecializationNotFoundThrowsException](#updatestaffasyncspecializationnotfoundthrowsexception)
15. [SearchStaffProfilesReturnsListOfStaffDTOWhenStaffProfilesFound](#searchstaffprofilesreturnslistofstaffdtowhenstaffprofilesfound)
16. [SearchStaffProfilesReturnsNullWhenNoStaffProfilesFound](#searchstaffprofilesreturnsnullwhennostaffprofilesfound)
17. [SearchStaffProfilesReturnsListOfStaffDTOWhenSpecializationNameProvidedAndFound](#searchstaffprofilesreturnslistofstaffdtowhenspecializationnameprovidedandfound)
18. [SearchStaffProfilesThrowsExceptionWhenSpecializationNameProvidedAndNotFound](#searchstaffprofilesthrowsexceptionwhenspecializationnameprovidedandnotfound)
19. [SearchStaffProfilesReturnsListOfStaffDTOWhenSpecializationAllFieldsProvidedAndFound](#searchstaffprofilesreturnslistofstaffdtowhenspecializationallfieldsprovidedandfound)
20. [Constructor_ValidInputs_ShouldCreateStaff](#constructor_validinputs_shouldcreatestaff)
21. [Constructor_InvalidEmail_ShouldThrowArgumentException](#constructor_invalidemail_shouldthrowargumentexception)
22. [Constructor_InvalidPhoneNumber_ShouldThrowArgumentException](#constructor_invalidphonenumber_shouldthrowargumentexception)
23. [Deactivate_ActiveStaff_ShouldDeactivate](#deactivate_activestaff_shoulddeactivate)
24. [Deactivate_AlreadyDeactivatedStaff_ShouldThrowException](#deactivate_alreadydeactivatedstaff_shouldthrowexception)
25. [ChangePhoneNumber_ValidPhoneNumber_ShouldChangePhoneNumber](#changephonenumber_validphonenumber_shouldchangephonenumber)
26. [ChangePhoneNumber_InvalidPhoneNumber_ShouldThrowException](#changephonenumber_invalidphonenumber_shouldthrowexception)
27. [ChangeEmail_ValidEmail_ShouldChangeEmail](#changeemail_validemail_shouldchangeemail)
28. [ChangeEmail_InvalidEmail_ShouldThrowException](#changeemail_invalidemail_shouldthrowexception)
29. [AddAvailabilitySlot_ValidSlot_ShouldAddSlot](#addavailabilityslot_validslot_shouldaddslot)
30. [AddAvailabilitySlot_InvalidFormat_ShouldThrowException](#addavailabilityslot_invalidformat_shouldthrowexception)
31. [AddAvailabilitySlot_ExistingSlot_ShouldThrowException](#addavailabilityslot_existingslot_shouldthrowexception)
32. [AddAvailabilitySlot_PastSlot_ShouldThrowException](#addavailabilityslot_pastslot_shouldthrowexception)
33. [RemoveAvailabilitySlot_ExistingSlot_ShouldRemoveSlot](#removeavailabilityslot_existingslot_shouldremoveslot)
34. [RemoveAvailabilitySlot_NonExistingSlot_ShouldThrowException](#removeavailabilityslot_nonexistingslot_shouldthrowexception)
35. [ChangeSpecializationId_ValidSpecializationId_ShouldChangeSpecializationId](#changespecializationid_validspecializationid_shouldchangespecializationid)
36. [ChangeSpecializationId_NullSpecializationId_ShouldThrowException](#changespecializationid_nullspecializationid_shouldthrowexception)

## Test Descriptions

### CreateStaffAsyncSuccessfullyTest

| **Purpose** | To verify that a staff member can be created successfully with valid input. |
|-------------|----------------------------------------------------------------------------|
| **Expected Result** | The staff member is created and all properties match the expected values. |
| **Type of Test** | Unit Test |

### CreateStaffFailsDueToDuplicatePhoneNumberTest

| **Purpose** | To verify that creating a staff member with a duplicate phone number throws an exception. |
|-------------|------------------------------------------------------------------------------------------|
| **Expected Result** | A `BusinessRuleValidationException` is thrown. |
| **Type of Test** | Unit Test |

### CreateStaffFailsDueToDuplicateEmailTest

| **Purpose** | To verify that creating a staff member with a duplicate email throws an exception. |
|-------------|-----------------------------------------------------------------------------------|
| **Expected Result** | A `BusinessRuleValidationException` is thrown. |
| **Type of Test** | Unit Test |

### CreateStaffFailsDueToSpecializationNotFoundTest

| **Purpose** | To verify that creating a staff member with a non-existing specialization throws an exception. |
|-------------|------------------------------------------------------------------------------------------------|
| **Expected Result** | A `BusinessRuleValidationException` is thrown. |
| **Type of Test** | Unit Test |

### DeactivateStaffAsyncSuccessfullyTest

| **Purpose** | To verify that a staff member can be deactivated successfully. |
|-------------|----------------------------------------------------------------|
| **Expected Result** | The staff member is deactivated and a log entry is created. |
| **Type of Test** | Unit Test |

### DeactivateStaffAsyncFailsStaffAlreadyDeactivatedTest

| **Purpose** | To verify that deactivating an already deactivated staff member throws an exception. |
|-------------|-------------------------------------------------------------------------------------|
| **Expected Result** | A `BusinessRuleValidationException` is thrown. |
| **Type of Test** | Unit Test |

### DeactivateStaffAsyncFailsStaffNotFoundTest

| **Purpose** | To verify that deactivating a non-existing staff member returns null. |
|-------------|------------------------------------------------------------------------|
| **Expected Result** | Null is returned. |
| **Type of Test** | Unit Test |

### UpdateStaffAsyncSuccessfullyUpdatesStaff

| **Purpose** | To verify that a staff member can be updated successfully with valid input. |
|-------------|----------------------------------------------------------------------------|
| **Expected Result** | The staff member is updated and all properties match the expected values. |
| **Type of Test** | Unit Test |

### UpdateStaffAsyncStaffNotFoundReturnsNull

| **Purpose** | To verify that updating a non-existing staff member returns null. |
|-------------|-------------------------------------------------------------------|
| **Expected Result** | Null is returned. |
| **Type of Test** | Unit Test |

### UpdateStaffAsyncPhoneNumberAlreadyInUseThrowsException

| **Purpose** | To verify that updating a staff member with a duplicate phone number throws an exception. |
|-------------|------------------------------------------------------------------------------------------|
| **Expected Result** | A `BusinessRuleValidationException` is thrown. |
| **Type of Test** | Unit Test |

### UpdateStaffAsyncEmailAlreadyInUseThrowsException

| **Purpose** | To verify that updating a staff member with a duplicate email throws an exception. |
|-------------|-----------------------------------------------------------------------------------|
| **Expected Result** | A `BusinessRuleValidationException` is thrown. |
| **Type of Test** | Unit Test |

### UpdateStaffAsyncAddAvailabilitySlotsInvalidFormatThrowsException

| **Purpose** | To verify that updating a staff member with an invalid availability slot format throws an exception. |
|-------------|-----------------------------------------------------------------------------------------------------|
| **Expected Result** | A `FormatException` is thrown. |
| **Type of Test** | Unit Test |

### UpdateStaffAsyncRemoveAvailabilitySlotsInvalidFormatThrowsException

| **Purpose** | To verify that updating a staff member with an invalid availability slot format throws an exception. |
|-------------|-----------------------------------------------------------------------------------------------------|
| **Expected Result** | A `FormatException` is thrown. |
| **Type of Test** | Unit Test |

### UpdateStaffAsyncSpecializationNotFoundThrowsException

| **Purpose** | To verify that updating a staff member with a non-existing specialization throws an exception. |
|-------------|------------------------------------------------------------------------------------------------|
| **Expected Result** | A `BusinessRuleValidationException` is thrown. |
| **Type of Test** | Unit Test |

### SearchStaffProfilesReturnsListOfStaffDTOWhenStaffProfilesFound

| **Purpose** | To verify that searching for staff profiles returns a list of matching staff profiles. |
|-------------|----------------------------------------------------------------------------------------|
| **Expected Result** | A list of matching staff profiles is returned. |
| **Type of Test** | Unit Test |

### SearchStaffProfilesReturnsNullWhenNoStaffProfilesFound

| **Purpose** | To verify that searching for staff profiles returns null when no matching profiles are found. |
|-------------|------------------------------------------------------------------------------------------------|
| **Expected Result** | Null is returned. |
| **Type of Test** | Unit Test |

### SearchStaffProfilesReturnsListOfStaffDTOWhenSpecializationNameProvidedAndFound

| **Purpose** | To verify that searching for staff profiles by specialization name returns a list of matching profiles. |
|-------------|---------------------------------------------------------------------------------------------------------|
| **Expected Result** | A list of matching staff profiles is returned. |
| **Type of Test** | Unit Test |

### SearchStaffProfilesThrowsExceptionWhenSpecializationNameProvidedAndNotFound

| **Purpose** | To verify that searching for staff profiles by a non-existing specialization name throws an exception. |
|-------------|-------------------------------------------------------------------------------------------------------|
| **Expected Result** | A `BusinessRuleValidationException` is thrown. |
| **Type of Test** | Unit Test |

### SearchStaffProfilesReturnsListOfStaffDTOWhenSpecializationAllFieldsProvidedAndFound

| **Purpose** | To verify that searching for staff profiles with all fields provided returns a list of matching profiles. |
|-------------|-----------------------------------------------------------------------------------------------------------|
| **Expected Result** | A list of matching staff profiles is returned. |
| **Type of Test** | Unit Test |

### Constructor_ValidInputs_ShouldCreateStaff

| **Purpose** | To verify that a staff member can be created successfully with valid inputs. |
|-------------|------------------------------------------------------------------------------|
| **Expected Result** | The staff member is created and all properties match the expected values. |
| **Type of Test** | Unit Test |

### Constructor_InvalidEmail_ShouldThrowArgumentException

| **Purpose** | To verify that creating a staff member with an invalid email throws an exception. |
|-------------|---------------------------------------------------------------------------------|
| **Expected Result** | An `ArgumentException` is thrown. |
| **Type of Test** | Unit Test |

### Constructor_InvalidPhoneNumber_ShouldThrowArgumentException

| **Purpose** | To verify that creating a staff member with an invalid phone number throws an exception. |
|-------------|-----------------------------------------------------------------------------------------|
| **Expected Result** | An `ArgumentException` is thrown. |
| **Type of Test** | Unit Test |

### Deactivate_ActiveStaff_ShouldDeactivate

| **Purpose** | To verify that an active staff member can be deactivated successfully. |
|-------------|------------------------------------------------------------------------|
| **Expected Result** | The staff member is deactivated. |
| **Type of Test** | Unit Test |

### Deactivate_AlreadyDeactivatedStaff_ShouldThrowException

| **Purpose** | To verify that deactivating an already deactivated staff member throws an exception. |
|-------------|-------------------------------------------------------------------------------------|
| **Expected Result** | A `BusinessRuleValidationException` is thrown. |
| **Type of Test** | Unit Test |

### ChangePhoneNumber_ValidPhoneNumber_ShouldChangePhoneNumber

| **Purpose** | To verify that changing a staff member's phone number to a valid phone number is successful. |
|-------------|---------------------------------------------------------------------------------------------|
| **Expected Result** | The phone number is changed. |
| **Type of Test** | Unit Test |

### ChangePhoneNumber_InvalidPhoneNumber_ShouldThrowException

| **Purpose** | To verify that changing a staff member's phone number to an invalid phone number throws an exception. |
|-------------|-----------------------------------------------------------------------------------------------------|
| **Expected Result** | An `ArgumentException` is thrown. |
| **Type of Test** | Unit Test |

### ChangeEmail_ValidEmail_ShouldChangeEmail

| **Purpose** | To verify that changing a staff member's email to a valid email is successful. |
|-------------|-------------------------------------------------------------------------------|
| **Expected Result** | The email is changed. |
| **Type of Test** | Unit Test |

### ChangeEmail_InvalidEmail_ShouldThrowException

| **Purpose** | To verify that changing a staff member's email to an invalid email throws an exception. |
|-------------|---------------------------------------------------------------------------------------|
| **Expected Result** | An `ArgumentException` is thrown. |
| **Type of Test** | Unit Test |

### AddAvailabilitySlot_ValidSlot_ShouldAddSlot

| **Purpose** | To verify that adding a valid availability slot to a staff member is successful. |
|-------------|---------------------------------------------------------------------------------|
| **Expected Result** | The availability slot is added. |
| **Type of Test** | Unit Test |

### AddAvailabilitySlot_InvalidFormat_ShouldThrowException

| **Purpose** | To verify that adding an availability slot with an invalid format throws an exception. |
|-------------|---------------------------------------------------------------------------------------|
| **Expected Result** | A `BusinessRuleValidationException` is thrown. |
| **Type of Test** | Unit Test |

### AddAvailabilitySlot_ExistingSlot_ShouldThrowException

| **Purpose** | To verify that adding an existing availability slot to a staff member throws an exception. |
|-------------|-------------------------------------------------------------------------------------------|
| **Expected Result** | A `BusinessRuleValidationException` is thrown. |
| **Type of Test** | Unit Test |

### AddAvailabilitySlot_PastSlot_ShouldThrowException

| **Purpose** | To verify that adding a past availability slot to a staff member throws an exception. |
|-------------|--------------------------------------------------------------------------------------|
| **Expected Result** | A `BusinessRuleValidationException` is thrown. |
| **Type of Test** | Unit Test |

### RemoveAvailabilitySlot_ExistingSlot_ShouldRemoveSlot

| **Purpose** | To verify that removing an existing availability slot from a staff member is successful. |
|-------------|-----------------------------------------------------------------------------------------|
| **Expected Result** | The availability slot is removed. |
| **Type of Test** | Unit Test |

### RemoveAvailabilitySlot_NonExistingSlot_ShouldThrowException

| **Purpose** | To verify that removing a non-existing availability slot from a staff member throws an exception. |
|-------------|-------------------------------------------------------------------------------------------------|
| **Expected Result** | A `BusinessRuleValidationException` is thrown. |
| **Type of Test** | Unit Test |

### ChangeSpecializationId_ValidSpecializationId_ShouldChangeSpecializationId

| **Purpose** | To verify that changing a staff member's specialization ID to a valid ID is successful. |
|-------------|----------------------------------------------------------------------------------------|
| **Expected Result** | The specialization ID is changed. |
| **Type of Test** | Unit Test |

### ChangeSpecializationId_NullSpecializationId_ShouldThrowException

| **Purpose** | To verify that changing a staff member's specialization ID to null throws an exception. |
|-------------|----------------------------------------------------------------------------------------|
| **Expected Result** | An `ArgumentException` is thrown. |
| **Type of Test** | Unit Test |