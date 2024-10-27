# Staff Tests

This document provides an overview of the tests related to the Staff Requirements. The tests are divided into three types: **Unit Tests**, **Integration Tests**, and **End-to-End Tests**.

## Summary

The following is a summary of the number of tests for each service method:

- **CreateStaff**: 5 tests
- **UpdateStaff**: 7 tests
- **DeactivateStaff**: 4 tests
- **SearchStaffs**: 13 tests
- **StaffMapper**: 3 tests
- **StaffDomain**: 18 tests

## Table of Contents

1. [CreateStaffSuccessfullyTest](#createstaffsuccessfullytest)
2. [CreateStaffFailsDueToDuplicateEmailTest](#createstafffailsduetoduplicateemailtest)
3. [CreateStaffFailsDueToDuplicatePhoneNumberTest](#createstafffailsduetoduplicatephonenumbertest)
4. [UpdateStaffNamesSuccessfullyTest](#updatestaffnamessuccessfullytest)
5. [UpdateStaffContactInformationSuccessfullyTest](#updatestaffcontactinformationsuccessfullytest)
6. [UpdateStaffSpecializationSuccessfullyTest](#updatestaffspecializationsuccessfullytest)
7. [UpdateStaffEverythingSuccessfullyTest](#updatestaffeverythingsuccessfullytest)
8. [UpdateStaffFailsWhenStaffDoesNotExistTest](#updatestafffailswhenstaffdoesnotexisttest)
9. [DeactivateStaffSucceedsWhenStaffExistsTest](#deactivatestaffsucceedswhenstaffexiststest)
10. [DeactivateStaffFailsWhenStaffDoesNotExistTest](#deactivatestafffailswhenstaffdoesnotexisttest)
11. [SearchStaffsFiltersByFirstName](#searchstaffsfiltersbyfirstname)
12. [SearchStaffsFiltersByLastName](#searchstaffsfiltersbylastname)
13. [SearchStaffsFiltersByFullName](#searchstaffsfiltersbyfullname)
14. [SearchStaffsFiltersBySpecialization](#searchstaffsfiltersbyspecialization)
15. [SearchStaffsFiltersByEmail](#searchstaffsfiltersbyemail)
16. [SearchStaffsFiltersByPhoneNumber](#searchstaffsfiltersbyphonenumber)
17. [SearchAllStaffs](#searchallstaffs)
18. [GetNullListOfStaffs](#getnulllistofstaffs)
19. [GetListWithMoreThanOneFilter](#getlistwithmorethanonefilter)
20. [MapToStaffDTOSuccessfully](#maptostaffdtosuccessfully)
21. [MapToDomainSuccessfully](#maptodomainuccessfully)
22. [MapToCreatingStaffDTOSuccessfully](#maptocreatingstaffdtosuccessfully)
23. [CreateStaffDirectlyFromDomainSuccessfully](#createstaffdirectlyfromdomainsuccessfully)
24. [CreateStaffDirectlyFromDomainWithInvalidFirstName](#createstaffdirectlyfromdomainwithinvalidfirstname)
25. [CreateStaffDirectlyFromDomainWithInvalidLastName](#createstaffdirectlyfromdomainwithinvalidlastname)
26. [CreateStaffDirectlyFromDomainWithInvalidFullName](#createstaffdirectlyfromdomainwithinvalidfullname)
27. [CreateStaffDirectlyFromDomainWithInvalidSpecialization](#createstaffdirectlyfromdomainwithinvalidspecialization)
28. [CreateStaffDirectlyFromDomainWithInvalidEmail](#createstaffdirectlyfromdomainwithinvalidemail)
29. [CreateStaffDirectlyFromDomainWithInvalidPhoneNumber](#createstaffdirectlyfromdomainwithinvalidphonenumber)
30. [ChangeFirstNameDirectlyFromDomainSuccessfully](#changefirstnamedirectlyfromdomainsuccessfully)
31. [ChangeLastNameDirectlyFromDomainSuccessfully](#changelastnamedirectlyfromdomainsuccessfully)
32. [ChangeFullNameDirectlyFromDomainSuccessfully](#changefullnamedirectlyfromdomainsuccessfully)
33. [ChangeEmailDirectlyFromDomainSuccessfully](#changeemaildirectlyfromdomainsuccessfully)
34. [ChangeEmailDirectlyFromDomainWithInvalidEmail](#changeemaildirectlyfromdomainwithinvalidemail)
35. [ChangePhoneNumberDirectlyFromDomainSuccessfully](#changephonenumberdirectlyfromdomainsuccessfully)
36. [ChangePhoneNumberDirectlyFromDomainWithInvalidPhoneNumber](#changephonenumberdirectlyfromdomainwithinvalidphonenumber)
37. [ChangeSpecializationDirectlyFromDomainSuccessfully](#changespecializationdirectlyfromdomainsuccessfully)
38. [ChangeSpecializationDirectlyFromDomainWithInvalidSpecialization](#changespecializationdirectlyfromdomainwithinvalidspecialization)
39. [CreateStaff_ShouldReturnOk_WhenStaffIsCreated](#createstaff_shouldreturnok_whenstaffiscreated)
40. [CreateStaff_ShouldReturnError_WhenStaffAlreadyExists](#createstaff_shouldreturnerror_whenstaffalreadyexists)
41. [DeactivateStaff_ShouldReturnOk_WhenStaffIsDeactivated](#deactivatestaff_shouldreturnok_whenstaffisdeactivated)
42. [DeactivateStaff_ShouldReturnNotFound_WhenStaffDoesNotExist](#deactivatestaff_shouldreturnnotfound_whenstaffdoesnotexist)
43. [UpdateStaff_ShouldReturnOk_WhenStaffIsUpdated](#updatestaff_shouldreturnok_whenstaffisupdated)
44. [UpdateStaff_ShouldReturnNotFound_WhenStaffDoesNotExist](#updatestaff_shouldreturnnotfound_whenstaffdoesnotexist)
45. [GetStaff_ShouldReturnOk_WhenStaffExists](#getstaff_shouldreturnok_whenstaffexists)
46. [GetStaff_ShouldReturnNotFound_WhenStaffDoesNotExist](#getstaff_shouldreturnnotfound_whenstaffdoesnotexist)

## Test Descriptions

### CreateStaffSuccessfullyTest

| **Purpose** | To verify that a staff member can be created successfully. |
|-------------|------------------------------------------------------------|
| **Expected Result** | The staff member is created and all properties match the expected values. |
| **Type of Test** | Unit Test |

### CreateStaffFailsDueToDuplicateEmailTest

| **Purpose** | To verify that creating a staff member fails if the email already exists. |
|-------------|--------------------------------------------------------------------------|
| **Expected Result** | A `BusinessRuleValidationException` is thrown. |
| **Type of Test** | Unit Test |

### CreateStaffFailsDueToDuplicatePhoneNumberTest

| **Purpose** | To verify that creating a staff member fails if the phone number already exists. |
|-------------|---------------------------------------------------------------------------------|
| **Expected Result** | A `BusinessRuleValidationException` is thrown. |
| **Type of Test** | Unit Test |

### UpdateStaffNamesSuccessfullyTest

| **Purpose** | To verify that a staff member's name can be updated successfully. |
|-------------|-------------------------------------------------------------------|
| **Expected Result** | The staff member's name is updated and a log entry is created. |
| **Type of Test** | Unit Test |

### UpdateStaffContactInformationSuccessfullyTest

| **Purpose** | To verify that a staff member's contact information can be updated successfully. |
|-------------|--------------------------------------------------------------------------------|
| **Expected Result** | The staff member's contact information is updated and a log entry is created. |
| **Type of Test** | Unit Test |

### UpdateStaffSpecializationSuccessfullyTest

| **Purpose** | To verify that a staff member's specialization can be updated successfully. |
|-------------|----------------------------------------------------------------------------|
| **Expected Result** | The staff member's specialization is updated and a log entry is created. |
| **Type of Test** | Unit Test |

### UpdateStaffEverythingSuccessfullyTest

| **Purpose** | To verify that all staff member details can be updated successfully. |
|-------------|---------------------------------------------------------------------|
| **Expected Result** | The staff member's details are updated and a log entry is created. |
| **Type of Test** | Unit Test |

### UpdateStaffFailsWhenStaffDoesNotExistTest

| **Purpose** | To verify that updating a staff member fails if the staff member does not exist. |
|-------------|--------------------------------------------------------------------------------|
| **Expected Result** | The result is `null`. |
| **Type of Test** | Unit Test |

### DeactivateStaffSucceedsWhenStaffExistsTest

| **Purpose** | To verify that a staff member can be deactivated successfully. |
|-------------|----------------------------------------------------------------|
| **Expected Result** | The staff member is deactivated and a log entry is created. |
| **Type of Test** | Unit Test |

### DeactivateStaffFailsWhenStaffDoesNotExistTest

| **Purpose** | To verify that deactivating a staff member fails if the staff member does not exist. |
|-------------|-----------------------------------------------------------------------------------|
| **Expected Result** | The result is `null`. |
| **Type of Test** | Unit Test |

### SearchStaffsFiltersByFirstName

| **Purpose** | To verify that staff members can be searched by first name. |
|-------------|-------------------------------------------------------------|
| **Expected Result** | The result contains staff members with the specified first name. |
| **Type of Test** | Unit Test |

### SearchStaffsFiltersByLastName

| **Purpose** | To verify that staff members can be searched by last name. |
|-------------|------------------------------------------------------------|
| **Expected Result** | The result contains staff members with the specified last name. |
| **Type of Test** | Unit Test |

### SearchStaffsFiltersByFullName

| **Purpose** | To verify that staff members can be searched by full name. |
|-------------|------------------------------------------------------------|
| **Expected Result** | The result contains staff members with the specified full name. |
| **Type of Test** | Unit Test |

### SearchStaffsFiltersBySpecialization

| **Purpose** | To verify that staff members can be searched by specialization. |
|-------------|----------------------------------------------------------------|
| **Expected Result** | The result contains staff members with the specified specialization. |
| **Type of Test** | Unit Test |

### SearchStaffsFiltersByEmail

| **Purpose** | To verify that staff members can be searched by email. |
|-------------|--------------------------------------------------------|
| **Expected Result** | The result contains staff members with the specified email. |
| **Type of Test** | Unit Test |

### SearchStaffsFiltersByPhoneNumber

| **Purpose** | To verify that staff members can be searched by phone number. |
|-------------|---------------------------------------------------------------|
| **Expected Result** | The result contains staff members with the specified phone number. |
| **Type of Test** | Unit Test |

### SearchAllStaffs

| **Purpose** | To verify that all staff members can be searched without any filters. |
|-------------|-----------------------------------------------------------------------|
| **Expected Result** | The result contains all staff members. |
| **Type of Test** | Unit Test |

### GetNullListOfStaffs

| **Purpose** | To verify that searching for staff members with non-matching criteria returns `null`. |
|-------------|-------------------------------------------------------------------------------------|
| **Expected Result** | The result is `null`. |
| **Type of Test** | Unit Test |

### GetListWithMoreThanOneFilter

| **Purpose** | To verify that staff members can be searched using multiple filters. |
|-------------|---------------------------------------------------------------------|
| **Expected Result** | The result contains staff members matching all specified filters. |
| **Type of Test** | Unit Test |

### MapToStaffDTOSuccessfully

| **Purpose** | To verify that a staff member can be mapped to a StaffDTO successfully. |
|-------------|------------------------------------------------------------------------|
| **Expected Result** | The StaffDTO contains all the expected values from the staff member. |
| **Type of Test** | Unit Test |

### MapToDomainSuccessfully

| **Purpose** | To verify that a CreatingStaffDTO can be mapped to a Staff domain object successfully. |
|-------------|---------------------------------------------------------------------------------------|
| **Expected Result** | The Staff domain object contains all the expected values from the CreatingStaffDTO. |
| **Type of Test** | Unit Test |

### MapToCreatingStaffDTOSuccessfully

| **Purpose** | To verify that a staff member can be mapped to a CreatingStaffDTO successfully. |
|-------------|--------------------------------------------------------------------------------|
| **Expected Result** | The CreatingStaffDTO contains all the expected values from the staff member. |
| **Type of Test** | Unit Test |

### CreateStaffDirectlyFromDomainSuccessfully

| **Purpose** | To verify that a staff member can be created directly from the domain successfully. |
|-------------|----------------------------------------------------------------------------------|
| **Expected Result** | The staff member is created and all properties match the expected values. |
| **Type of Test** | Unit Test |

### CreateStaffDirectlyFromDomainWithInvalidFirstName

| **Purpose** | To verify that creating a staff member directly from the domain fails if the first name is invalid. |
|-------------|----------------------------------------------------------------------------------------------------|
| **Expected Result** | A `BusinessRuleValidationException` is thrown. |
| **Type of Test** | Unit Test |

### CreateStaffDirectlyFromDomainWithInvalidLastName

| **Purpose** | To verify that creating a staff member directly from the domain fails if the last name is invalid. |
|-------------|---------------------------------------------------------------------------------------------------|
| **Expected Result** | A `BusinessRuleValidationException` is thrown. |
| **Type of Test** | Unit Test |

### CreateStaffDirectlyFromDomainWithInvalidFullName

| **Purpose** | To verify that creating a staff member directly from the domain fails if the full name is invalid. |
|-------------|---------------------------------------------------------------------------------------------------|
| **Expected Result** | A `BusinessRuleValidationException` is thrown. |
| **Type of Test** | Unit Test |

### CreateStaffDirectlyFromDomainWithInvalidSpecialization

| **Purpose** | To verify that creating a staff member directly from the domain fails if the specialization is invalid. |
|-------------|-------------------------------------------------------------------------------------------------------|
| **Expected Result** | A `BusinessRuleValidationException` is thrown. |
| **Type of Test** | Unit Test |

### CreateStaffDirectlyFromDomainWithInvalidEmail

| **Purpose** | To verify that creating a staff member directly from the domain fails if the email is invalid. |
|-------------|------------------------------------------------------------------------------------------------|
| **Expected Result** | A `BusinessRuleValidationException` is thrown. |
| **Type of Test** | Unit Test |

### CreateStaffDirectlyFromDomainWithInvalidPhoneNumber

| **Purpose** | To verify that creating a staff member directly from the domain fails if the phone number is invalid. |
|-------------|------------------------------------------------------------------------------------------------------|
| **Expected Result** | A `BusinessRuleValidationException` is thrown. |
| **Type of Test** | Unit Test |

### ChangeFirstNameDirectlyFromDomainSuccessfully

| **Purpose** | To verify that a staff member's first name can be changed directly from the domain successfully. |
|-------------|-------------------------------------------------------------------------------------------------|
| **Expected Result** | The staff member's first name is updated. |
| **Type of Test** | Unit Test |

### ChangeLastNameDirectlyFromDomainSuccessfully

| **Purpose** | To verify that a staff member's last name can be changed directly from the domain successfully. |
|-------------|------------------------------------------------------------------------------------------------|
| **Expected Result** | The staff member's last name is updated. |
| **Type of Test** | Unit Test |

### ChangeFullNameDirectlyFromDomainSuccessfully

| **Purpose** | To verify that a staff member's full name can be changed directly from the domain successfully. |
|-------------|------------------------------------------------------------------------------------------------|
| **Expected Result** | The staff member's full name is updated. |
| **Type of Test** | Unit Test |

### ChangeEmailDirectlyFromDomainSuccessfully

| **Purpose** | To verify that a staff member's email can be changed directly from the domain successfully. |
|-------------|------------------------------------------------------------------------------------------------|
| **Expected Result** | The staff member's email is updated. |
| **Type of Test** | Unit Test |

### ChangeEmailDirectlyFromDomainWithInvalidEmail

| **Purpose** | To verify that changing a staff member's email directly from the domain fails if the email is invalid. |
|-------------|-----------------------------------------------------------------------------------------------------|
| **Expected Result** | An `ArgumentException` is thrown. |
| **Type of Test** | Unit Test |

### ChangePhoneNumberDirectlyFromDomainSuccessfully

| **Purpose** | To verify that a staff member's phone number can be changed directly from the domain successfully. |
|-------------|---------------------------------------------------------------------------------------------------|
| **Expected Result** | The staff member's phone number is updated. |
| **Type of Test** | Unit Test |

### ChangePhoneNumberDirectlyFromDomainWithInvalidPhoneNumber

| **Purpose** | To verify that changing a staff member's phone number directly from the domain fails if the phone number is invalid. |
|-------------|-------------------------------------------------------------------------------------------------------------------|
| **Expected Result** | A `BusinessRuleValidationException` is thrown. |
| **Type of Test** | Unit Test |

### ChangeSpecializationDirectlyFromDomainSuccessfully

| **Purpose** | To verify that a staff member's specialization can be changed directly from the domain successfully. |
|-------------|----------------------------------------------------------------------------------------------------|
| **Expected Result** | The staff member's specialization is updated. |
| **Type of Test** | Unit Test |

### ChangeSpecializationDirectlyFromDomainWithInvalidSpecialization

| **Purpose** | To verify that changing a staff member's specialization directly from the domain fails if the specialization is invalid. |
|-------------|----------------------------------------------------------------------------------------------------------------------|
| **Expected Result** | A `BusinessRuleValidationException` is thrown. |
| **Type of Test** | Unit Test |

### CreateStaff_ShouldReturnOk_WhenStaffIsCreated

| **Purpose** | To verify that a staff member can be created successfully. |
|-------------|------------------------------------------------------------|
| **Expected Result** | The response status is 200. |
| **Type of Test** | Integration Test |

### CreateStaff_ShouldReturnError_WhenStaffAlreadyExists

| **Purpose** | To verify that creating a staff member fails if the staff member already exists. |
|-------------|--------------------------------------------------------------------------------|
| **Expected Result** | The response status is 400. |
| **Type of Test** | Integration Test |

### DeactivateStaff_ShouldReturnOk_WhenStaffIsDeactivated

| **Purpose** | To verify that a staff member can be deactivated successfully. |
|-------------|----------------------------------------------------------------|
| **Expected Result** | The response status is 200. |
| **Type of Test** | Integration Test |

### DeactivateStaff_ShouldReturnNotFound_WhenStaffDoesNotExist

| **Purpose** | To verify that deactivating a staff member fails if the staff member does not exist. |
|-------------|-----------------------------------------------------------------------------------|
| **Expected Result** | The response status is 404. |
| **Type of Test** | Integration Test |

### UpdateStaff_ShouldReturnOk_WhenStaffIsUpdated

| **Purpose** | To verify that a staff member can be updated successfully. |
|-------------|------------------------------------------------------------|
| **Expected Result** | The response status is 200. |
| **Type of Test** | Integration Test |

### UpdateStaff_ShouldReturnNotFound_WhenStaffDoesNotExist

| **Purpose** | To verify that updating a staff member fails if the staff member does not exist. |
|-------------|--------------------------------------------------------------------------------|
| **Expected Result** | The response status is 404. |
| **Type of Test** | Integration Test |

### GetStaff_ShouldReturnNotFound_WhenStaffDoesNotExist

| **Purpose** | To verify that retrieving a staff member fails if the staff member does not exist. |
|-------------|----------------------------------------------------------------------------------|
| **Expected Result** | The response status is 404. |
| **Type of Test** | Integration Test |

