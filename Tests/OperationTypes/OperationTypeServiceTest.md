# Operation Type Tests

This document provides an overview of the tests related to the Operation Type Requirements. The tests are divided into three types: **Unit Tests**, **Integration Tests**, and **End-to-End Tests**.

## Summary

The following is a summary of the number of tests for each service method:

- **CreateOperationType**: 3 unit tests, 3 integration tests
- **UpdateOperationType**: 4 unit tests, 4 integration tests
- **DeactivateOperationType**: 2 unit tests, 3 integration tests
- **ActivateOperationType**: 2 unit tests
- **GetAllOperationsType**: 2 unit tests
- **GetOperationTypesByName**: 2 unit tests, 1 integration test
- **GetOperationTypeWithStaffs**: 2 unit tests
- **GetOperationTypesByStatus**: 3 unit tests

## Table of Contents

1. [CreateOperationTypeAsync_ValidInput](#createoperationtypeasync_validinput)
2. [CreateOperationType_WithExistingName](#createoperationtype_withexistingname)
3. [CreateOperationType_WithNonExistingSpecialization_ShouldThrowKeyNotFoundException](#createoperationtype_withnonexistingspecialization_shouldthrowkeynotfoundexception)
4. [UpdateOperationTypeAsync_OperationTypeNotFound_ShouldThrowKeyNotFoundException](#updateoperationtypeasync_operationtypenotfound_shouldthrowkeynotfoundexception)
5. [UpdateOperationTypeAsync_ShouldUpdateName](#updateoperationtypeasync_shouldupdatename)
6. [UpdateOperationTypeAsync_ShouldUpdateEstimatedDuration](#updateoperationtypeasync_shouldupdateestimatedduration)
7. [UpdateOperationTypeAsync_ShouldUpdateSpecializations](#updateoperationtypeasync_shouldupdatespecializations)
8. [UpdateOperationTypeAsync_WithNonExistingSpecialization](#updateoperationtypeasync_withnonexistingspecialization)
9. [DeactivateOperationTypeAsync_OperationTypeNotFound](#deactivateoperationtypeasync_operationtypenotfound)
10. [DeactivateOperationTypeAsync](#deactivateoperationtypeasync)
11. [ActivateOperationTypeAsync_OperationTypeNotFound](#activateoperationtypeasync_operationtypenotfound)
12. [ActivateOperationTypeAsync_ShouldActivateOperationType](#activateoperationtypeasync_shouldactivateoperationtype)
13. [GetAllOperationsTypeAsync_NoOperationTypes](#getalloperationstypeasync_nooperationtypes)
14. [GetAllOperationsTypeAsync_OperationTypesExist](#getalloperationstypeasync_operationtypesexist)
15. [GetOperationTypesByNameAsync_OperationTypeNotFound](#getoperationtypesbynameasync_operationtypenotfound)
16. [GetOperationTypesByNameAsync](#getoperationtypesbynameasync)
17. [GetOperationTypeWithStaffsAsync_OperationTypeNotFound](#getoperationtypewithstaffsasync_operationtypenotfound)
18. [GetOperationTypeWithStaffsAsync](#getoperationtypewithstaffsasync)
19. [GetOperationTypesByStatusAsync_OperationTypeNotFound](#getoperationtypesbystatusasync_operationtypenotfound)
20. [GetOperationTypesByStatusTrueAsync](#getoperationtypesbystatustrueasync)
21. [GetOperationTypesByStatusFalseAsync](#getoperationtypesbystatusfalseasync)
22. [CreateOperationType_ShouldReturnOk_WhenOperationTypeIsCreated](#createoperationtype_shouldreturnok_whenoperationtypeiscreated)
23. [CreateOperationType_ShouldReturnError_WhenNameAlreadyExists](#createoperationtype_shouldreturnerror_whennamealreadyexists)
24. [CreateOperationType_ShouldReturnError_WhenSpecializationIsBlank](#createoperationtype_shouldreturnerror_whenspecializationisblank)
25. [CreateOperationType_ShouldReturnError_WhenSpecializationIsNotFound](#createoperationtype_shouldreturnerror_whenspecializationisnotfound)
26. [UpdateOperationType_ShouldReturnOk_WhenOperationTypeIsUpdated](#updateoperationtype_shouldreturnok_whenoperationtypeisupdated)
27. [UpdateOperationType_ShouldReturnNotFound_WhenOperationTypeDoesNotExist](#updateoperationtype_shouldreturnnotfound_whenoperationtypedoesnotexist)
28. [UpdateOperationType_ShouldReturnBadRequest_WhenSpecializationDoesNotExist](#updateoperationtype_shouldreturnbadrequest_whenspecializationdoesnotexist)
29. [UpdateOperationType_ShouldReturnUnauthorized_WhenUserIsNotAdmin](#updateoperationtype_shouldreturnunauthorized_whenuserisnotadmin)
30. [DeactivateOperationType_ShouldReturnOk_WhenOperationTypeIsDeactivated](#deactivateoperationtype_shouldreturnok_whenoperationtypeisdeactivated)
31. [DeactivateOperationType_ShouldReturnNotFound_WhenOperationTypeDoesNotExist](#deactivateoperationtype_shouldreturnnotfound_whenoperationtypedoesnotexist)
32. [DeactivateOperationType_ShouldReturnBadRequest_WhenInvalidOperation](#deactivateoperationtype_shouldreturnbadrequest_wheninvalidoperation)
33. [DeactivateOperationType_ShouldReturnUnauthorized_WhenUserIsNotAdmin](#deactivateoperationtype_shouldreturnunauthorized_whenuserisnotadmin)
34. [GetOperationType_ShouldReturnOk_WhenOperationTypeExists](#getoperationtype_shouldreturnok_whenoperationtypeexists)
35. [GetOperationType_ShouldReturnNotFound_WhenOperationTypeDoesNotExist](#getoperationtype_shouldreturnnotfound_whenoperationtypedoesnotexist)
36. [GetOperationTypeByName_ShouldReturnOk_WhenOperationTypeExists](#getoperationtypebyname_shouldreturnok_whenoperationtypeexists)

## Test Descriptions

### CreateOperationTypeAsync_ValidInput

| **Purpose** | To verify that an operation type can be created successfully with valid input. |
|-------------|-------------------------------------------------------------------------------|
| **Expected Result** | The operation type is created and all properties match the expected values. |
| **Type of Test** | Unit Test |

### CreateOperationType_WithExistingName

| **Purpose** | To verify that creating an operation type with an existing name throws an exception. |
|-------------|-------------------------------------------------------------------------------------|
| **Expected Result** | An exception is thrown with the message "An operation with the name '{dto.Name}' already exists." |
| **Type of Test** | Unit Test |

### CreateOperationType_WithNonExistingSpecialization_ShouldThrowKeyNotFoundException

| **Purpose** | To verify that creating an operation type with a non-existing specialization throws a KeyNotFoundException. |
|-------------|------------------------------------------------------------------------------------------------------------|
| **Expected Result** | A KeyNotFoundException is thrown with the message "Specialization with ID {nonExistingSpecializationId} not found." |
| **Type of Test** | Unit Test |

### UpdateOperationTypeAsync_OperationTypeNotFound_ShouldThrowKeyNotFoundException

| **Purpose** | To verify that updating a non-existing operation type throws a KeyNotFoundException. |
|-------------|-------------------------------------------------------------------------------------|
| **Expected Result** | A KeyNotFoundException is thrown with the message "OperationType with name {operationTypeName} not found." |
| **Type of Test** | Unit Test |

### UpdateOperationTypeAsync_ShouldUpdateName

| **Purpose** | To verify that the name of an existing operation type can be updated successfully. |
|-------------|-----------------------------------------------------------------------------------|
| **Expected Result** | The name of the operation type is updated to "Updated Operation". |
| **Type of Test** | Unit Test |

### UpdateOperationTypeAsync_ShouldUpdateEstimatedDuration

| **Purpose** | To verify that the estimated duration of an existing operation type can be updated successfully. |
|-------------|------------------------------------------------------------------------------------------------|
| **Expected Result** | The estimated duration of the operation type is updated to "3 hours". |
| **Type of Test** | Unit Test |

### UpdateOperationTypeAsync_ShouldUpdateSpecializations

| **Purpose** | To verify that the specializations of an existing operation type can be updated successfully. |
|-------------|---------------------------------------------------------------------------------------------|
| **Expected Result** | The specializations of the operation type are updated to include the new specialization. |
| **Type of Test** | Unit Test |

### UpdateOperationTypeAsync_WithNonExistingSpecialization

| **Purpose** | To verify that updating an operation type with a non-existing specialization throws a KeyNotFoundException. |
|-------------|------------------------------------------------------------------------------------------------------------|
| **Expected Result** | A KeyNotFoundException is thrown with the message "Specialization with ID {nonExistingSpecializationId} not found." |
| **Type of Test** | Unit Test |

### DeactivateOperationTypeAsync_OperationTypeNotFound

| **Purpose** | To verify that deactivating a non-existing operation type throws a KeyNotFoundException. |
|-------------|-----------------------------------------------------------------------------------------|
| **Expected Result** | A KeyNotFoundException is thrown with the message "OperationType with name {operationName} not found." |
| **Type of Test** | Unit Test |

### DeactivateOperationTypeAsync

| **Purpose** | To verify that an existing operation type can be deactivated successfully. |
|-------------|----------------------------------------------------------------------------|
| **Expected Result** | The operation type is deactivated and a log entry is created. |
| **Type of Test** | Unit Test |

### ActivateOperationTypeAsync_OperationTypeNotFound

| **Purpose** | To verify that activating a non-existing operation type throws a KeyNotFoundException. |
|-------------|---------------------------------------------------------------------------------------|
| **Expected Result** | A KeyNotFoundException is thrown with the message "OperationType with name {operationName} not found." |
| **Type of Test** | Unit Test |

### ActivateOperationTypeAsync_ShouldActivateOperationType

| **Purpose** | To verify that an existing operation type can be activated successfully. |
|-------------|----------------------------------------------------------------------------|
| **Expected Result** | The operation type is activated and a log entry is created. |
| **Type of Test** | Unit Test |

### GetAllOperationsTypeAsync_NoOperationTypes

| **Purpose** | To verify that retrieving all operation types returns an empty list when no operation types exist. |
|-------------|---------------------------------------------------------------------------------------------------|
| **Expected Result** | An empty list is returned. |
| **Type of Test** | Unit Test |

### GetAllOperationsTypeAsync_OperationTypesExist

| **Purpose** | To verify that retrieving all operation types returns a list of existing operation types. |
|-------------|------------------------------------------------------------------------------------------|
| **Expected Result** | A list of existing operation types is returned. |
| **Type of Test** | Unit Test |

### GetOperationTypesByNameAsync_OperationTypeNotFound

| **Purpose** | To verify that retrieving an operation type by name throws a KeyNotFoundException when the operation type does not exist. |
|-------------|-------------------------------------------------------------------------------------------------------------------------|
| **Expected Result** | A KeyNotFoundException is thrown with the message "OperationType with Name {operationName} not found." |
| **Type of Test** | Unit Test |

### GetOperationTypesByNameAsync

| **Purpose** | To verify that retrieving an operation type by name returns the expected operation type. |
|-------------|-----------------------------------------------------------------------------------------|
| **Expected Result** | The expected operation type is returned. |
| **Type of Test** | Unit Test |

### GetOperationTypeWithStaffsAsync_OperationTypeNotFound

| **Purpose** | To verify that retrieving an operation type with staffs by ID throws a KeyNotFoundException when the operation type does not exist. |
|-------------|-------------------------------------------------------------------------------------------------------------------------------|
| **Expected Result** | A KeyNotFoundException is thrown with the message "OperationType with ID {operationTypeId} not found." |
| **Type of Test** | Unit Test |

### GetOperationTypeWithStaffsAsync

| **Purpose** | To verify that retrieving an operation type with staffs by ID returns the expected operation type with staffs. |
|-------------|-------------------------------------------------------------------------------------------------------------|
| **Expected Result** | The expected operation type with staffs is returned. |
| **Type of Test** | Unit Test |

### GetOperationTypesByStatusAsync_OperationTypeNotFound

| **Purpose** | To verify that retrieving operation types by status throws a KeyNotFoundException when no operation types with the specified status exist. |
|-------------|---------------------------------------------------------------------------------------------------------------------------------------|
| **Expected Result** | A KeyNotFoundException is thrown with the message "OperationType with status {status} not found." |
| **Type of Test** | Unit Test |

### GetOperationTypesByStatusTrueAsync

| **Purpose** | To verify that retrieving operation types with a status of true returns the expected operation types. |
|-------------|-----------------------------------------------------------------------------------------------------|
| **Expected Result** | A list of operation types with a status of true is returned. |
| **Type of Test** | Unit Test |

### GetOperationTypesByStatusFalseAsync

| **Purpose** | To verify that retrieving operation types with a status of false returns the expected operation types. |
|-------------|------------------------------------------------------------------------------------------------------|
| **Expected Result** | A list of operation types with a status of false is returned. |
| **Type of Test** | Unit Test |

### CreateOperationType_ShouldReturnOk_WhenOperationTypeIsCreated

| **Purpose** | To verify that an operation type can be created successfully via the API. |
|-------------|--------------------------------------------------------------------------|
| **Expected Result** | The operation type is created and the response status is OK. |
| **Type of Test** | Integration Test |

### CreateOperationType_ShouldReturnError_WhenNameAlreadyExists

| **Purpose** | To verify that creating an operation type with an existing name returns an error. |
|-------------|----------------------------------------------------------------------------------|
| **Expected Result** | The response status is BadRequest. |
| **Type of Test** | Integration Test |

### CreateOperationType_ShouldReturnError_WhenSpecializationIsBlank

| **Purpose** | To verify that creating an operation type with a blank specialization returns an error. |
|-------------|---------------------------------------------------------------------------------------|
| **Expected Result** | The response status is BadRequest. |
| **Type of Test** | Integration Test |

### CreateOperationType_ShouldReturnError_WhenSpecializationIsNotFound

| **Purpose** | To verify that creating an operation type with a non-existing specialization returns an error. |
|-------------|----------------------------------------------------------------------------------------------|
| **Expected Result** | The response status is NotFound. |
| **Type of Test** | Integration Test |

### UpdateOperationType_ShouldReturnOk_WhenOperationTypeIsUpdated

| **Purpose** | To verify that an operation type can be updated successfully via the API. |
|-------------|---------------------------------------------------------------------------|
| **Expected Result** | The operation type is updated and the response status is OK. |
| **Type of Test** | Integration Test |

### UpdateOperationType_ShouldReturnNotFound_WhenOperationTypeDoesNotExist

| **Purpose** | To verify that updating a non-existing operation type returns an error. |
|-------------|-------------------------------------------------------------------------|
| **Expected Result** | The response status is NotFound. |
| **Type of Test** | Integration Test |

### UpdateOperationType_ShouldReturnBadRequest_WhenSpecializationDoesNotExist

| **Purpose** | To verify that updating an operation type with a non-existing specialization returns an error. |
|-------------|----------------------------------------------------------------------------------------------|
| **Expected Result** | The response status is NotFound. |
| **Type of Test** | Integration Test |

### UpdateOperationType_ShouldReturnUnauthorized_WhenUserIsNotAdmin

| **Purpose** | To verify that updating an operation type without admin privileges returns an error. |
|-------------|-------------------------------------------------------------------------------------|
| **Expected Result** | The response status is Unauthorized. |
| **Type of Test** | Integration Test |

### DeactivateOperationType_ShouldReturnOk_WhenOperationTypeIsDeactivated

| **Purpose** | To verify that an operation type can be deactivated successfully via the API. |
|-------------|-------------------------------------------------------------------------------|
| **Expected Result** | The operation type is deactivated and the response status is OK. |
| **Type of Test** | Integration Test |

### DeactivateOperationType_ShouldReturnNotFound_WhenOperationTypeDoesNotExist

| **Purpose** | To verify that deactivating a non-existing operation type returns an error. |
|-------------|----------------------------------------------------------------------------|
| **Expected Result** | The response status is NotFound. |
| **Type of Test** | Integration Test |

### DeactivateOperationType_ShouldReturnBadRequest_WhenInvalidOperation

| **Purpose** | To verify that deactivating an invalid operation type returns an error. |
|-------------|-------------------------------------------------------------------------|
| **Expected Result** | The response status is BadRequest. |
| **Type of Test** | Integration Test |

### DeactivateOperationType_ShouldReturnUnauthorized_WhenUserIsNotAdmin

| **Purpose** | To verify that deactivating an operation type without admin privileges returns an error. |
|-------------|-----------------------------------------------------------------------------------------|
| **Expected Result** | The response status is Unauthorized. |
| **Type of Test** | Integration Test |

### GetOperationType_ShouldReturnOk_WhenOperationTypeExists

| **Purpose** | To verify that retrieving an existing operation type returns the expected operation type. |
|-------------|------------------------------------------------------------------------------------------|
| **Expected Result** | The response status is OK and the expected operation type is returned. |
| **Type of Test** | Integration Test |

### GetOperationType_ShouldReturnNotFound_WhenOperationTypeDoesNotExist

| **Purpose** | To verify that retrieving a non-existing operation type returns an error. |
|-------------|---------------------------------------------------------------------------|
| **Expected Result** | The response status is NotFound. |
| **Type of Test** | Integration Test |

### GetOperationTypeByName_ShouldReturnOk_WhenOperationTypeExists

| **Purpose** | To verify that retrieving an existing operation type by name returns the expected operation type. |
|-------------|--------------------------------------------------------------------------------------------------|
| **Expected Result** | The response status is OK and the expected operation type is returned. |
| **Type of Test** | Integration Test |