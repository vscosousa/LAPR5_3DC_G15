# Staff Service Integration Tests

This document provides an overview of the integration tests related to the Staff Service.

## Summary

The following is a summary of the number of tests for each service method:

- **CreateStaff**: 3 tests
- **DeactivateStaff**: 3 tests
- **UpdateStaff**: 4 tests
- **SearchStaffProfiles**: 3 tests

## Table of Contents

1. [CreateStaff_ShouldReturnOk_WhenStaffIsCreated](#createstaff_shouldreturnok_whenstaffiscreated)
2. [CreateStaff_ShouldReturnError_WhenEmailAlreadyExists](#createstaff_shouldreturnerror_whenemailalreadyexists)
3. [CreateStaff_ShouldReturnError_WhenPhoneNumberAlreadyExists](#createstaff_shouldreturnerror_whenphonenumberalreadyexists)
4. [DeactivateStaff_ShouldReturnOk_WhenStaffIsDeactivated](#deactivatestaff_shouldreturnok_whenstaffisdeactivated)
5. [DeactivateStaff_ShouldReturnNotFound_WhenStaffDoesNotExist](#deactivatestaff_shouldreturnnotfound_whenstaffdoesnotexist)
6. [DeactivateStaff_ShouldReturnError_WhenStaffAlreadyDeactivated](#deactivatestaff_shouldreturnerror_whenstaffalreadydeactivated)
7. [UpdateStaff_ShouldReturnOk_WhenStaffIsUpdated](#updatestaff_shouldreturnok_whenstaffisupdated)
8. [UpdateStaff_ShouldReturnNotFound_WhenStaffDoesNotExist](#updatestaff_shouldreturnnotfound_whenstaffdoesnotexist)
9. [UpdateStaff_ShouldReturnError_WhenEmailAlreadyExists](#updatestaff_shouldreturnerror_whenemailalreadyexists)
10. [UpdateStaff_ShouldReturnError_WhenPhoneNumberAlreadyExists](#updatestaff_shouldreturnerror_whenphonenumberalreadyexists)
11. [SearchStaffProfiles_ShouldReturnOk_WhenProfilesFound](#searchstaffprofiles_shouldreturnok_whenprofilesfound)
12. [SearchStaffProfiles_ShouldReturnNotFound_WhenNoProfilesFound](#searchstaffprofiles_shouldreturnnotfound_whennoprofilesfound)
13. [SearchStaffProfiles_ShouldReturnError_WhenInvalidSearchCriteria](#searchstaffprofiles_shouldreturnerror_wheninvalidsearchcriteria)

## Test Descriptions

### CreateStaff_ShouldReturnOk_WhenStaffIsCreated

| **Purpose** | To verify that a staff member can be created successfully. |
|-------------|------------------------------------------------------------|
| **Expected Result** | The staff member is created and the response status is OK. |
| **Type of Test** | Integration Test |

### CreateStaff_ShouldReturnError_WhenEmailAlreadyExists

| **Purpose** | To verify that creating a staff member with an existing email returns an error. |
|-------------|-------------------------------------------------------------------------------|
| **Expected Result** | The response status is BadRequest. |
| **Type of Test** | Integration Test |

### CreateStaff_ShouldReturnError_WhenPhoneNumberAlreadyExists

| **Purpose** | To verify that creating a staff member with an existing phone number returns an error. |
|-------------|--------------------------------------------------------------------------------------|
| **Expected Result** | The response status is BadRequest. |
| **Type of Test** | Integration Test |

### DeactivateStaff_ShouldReturnOk_WhenStaffIsDeactivated

| **Purpose** | To verify that a staff member can be deactivated successfully. |
|-------------|---------------------------------------------------------------|
| **Expected Result** | The staff member is deactivated and the response status is OK. |
| **Type of Test** | Integration Test |

### DeactivateStaff_ShouldReturnNotFound_WhenStaffDoesNotExist

| **Purpose** | To verify that deactivating a non-existing staff member returns an error. |
|-------------|--------------------------------------------------------------------------|
| **Expected Result** | The response status is NotFound. |
| **Type of Test** | Integration Test |

### DeactivateStaff_ShouldReturnError_WhenStaffAlreadyDeactivated

| **Purpose** | To verify that deactivating an already deactivated staff member returns an error. |
|-------------|---------------------------------------------------------------------------------|
| **Expected Result** | The response status is BadRequest. |
| **Type of Test** | Integration Test |

### UpdateStaff_ShouldReturnOk_WhenStaffIsUpdated

| **Purpose** | To verify that a staff member can be updated successfully. |
|-------------|------------------------------------------------------------|
| **Expected Result** | The staff member is updated and the response status is OK. |
| **Type of Test** | Integration Test |

### UpdateStaff_ShouldReturnNotFound_WhenStaffDoesNotExist

| **Purpose** | To verify that updating a non-existing staff member returns an error. |
|-------------|-----------------------------------------------------------------------|
| **Expected Result** | The response status is NotFound. |
| **Type of Test** | Integration Test |

### UpdateStaff_ShouldReturnError_WhenEmailAlreadyExists

| **Purpose** | To verify that updating a staff member with an existing email returns an error. |
|-------------|-------------------------------------------------------------------------------|
| **Expected Result** | The response status is BadRequest. |
| **Type of Test** | Integration Test |

### UpdateStaff_ShouldReturnError_WhenPhoneNumberAlreadyExists

| **Purpose** | To verify that updating a staff member with an existing phone number returns an error. |
|-------------|--------------------------------------------------------------------------------------|
| **Expected Result** | The response status is BadRequest. |
| **Type of Test** | Integration Test |

### SearchStaffProfiles_ShouldReturnOk_WhenProfilesFound

| **Purpose** | To verify that searching for staff profiles returns a list of matching profiles. |
|-------------|---------------------------------------------------------------------------------|
| **Expected Result** | The response status is OK and a list of matching profiles is returned. |
| **Type of Test** | Integration Test |

### SearchStaffProfiles_ShouldReturnNotFound_WhenNoProfilesFound

| **Purpose** | To verify that searching for staff profiles returns an error when no matching profiles are found. |
|-------------|--------------------------------------------------------------------------------------------------|
| **Expected Result** | The response status is NotFound. |
| **Type of Test** | Integration Test |

### SearchStaffProfiles_ShouldReturnError_WhenInvalidSearchCriteria

| **Purpose** | To verify that searching for staff profiles with invalid search criteria returns an error. |
|-------------|-------------------------------------------------------------------------------------------|
| **Expected Result** | The response status is BadRequest. |
| **Type of Test** | Integration Test |