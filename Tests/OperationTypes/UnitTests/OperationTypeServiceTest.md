# Operation Type Tests

This document provides an overview of the tests related to the Operation Type Requirements. The tests are divided into three types: **Unit Tests**, **Integration Tests**, and **End-to-End Tests**.

## Summary

The following is a summary of the number of tests for each service method:

- **CreateOperationType**: 3 tests
- **UpdateOperationType**: 4 tests
- **DeactivateOperationType**: 2 tests
- **ActivateOperationType**: 2 tests
- **GetAllOperationsType**: 2 tests
- **GetOperationTypesByName**: 2 tests
- **GetOperationTypeWithStaffs**: 2 tests
- **GetOperationTypesByStatus**: 3 tests

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