# User Tests

This document provides an overview of the tests related to the User Requirements. The tests are divided into three types: **Unit Tests**, **Integration Tests**, and **End-to-End Tests**.

## Summary

The following is a summary of the number of tests for each service method:

- **CreateUser**: 3 tests
- **ActivateUser**: 3 tests
- **Login**: 6 tests
- **CreateUserAsPatient**: 3 tests
- **ActivateUserAsPatient**: 3 tests
- **RequestDelete**: 2 tests
- **DeleteUser**: 2 tests

## Table of Contents

1. [CreateUserSuccessfullyTest](#createusersuccessfullytest)
2. [CreateUserEmailIsAlreadyInUseTest](#createuseremailisalreadyinusetest)
3. [CreateUserUsernameIsAlreadyInUseTest](#createuserusernameisalreadyinusetest)
4. [ActivateUserExpiredTokenThrowsSecurityTokenExceptionTest](#activateuserexpiredtokenthrowssecuritytokenexceptiontest)
5. [ActivateUserInvalidPasswordThrowsArgumentExceptionTest](#activateuserinvalidpasswordthrowsargumentexceptiontest)
6. [ActivateUserSuccessfullyActivatesUserTest](#activateusersuccessfullyactivatesusertest)
7. [LoginEmailNotRegisteredThrowsExceptionTest](#loginemailnotregisteredthrowsexceptiontest)
8. [LoginUserNotActiveReturnsUserNotActiveMessageTest](#loginusernotactivereturnsusernotactivemessagetest)
9. [LoginUserLockedReturnsAccountLockedMessageTest](#loginuserlockedreturnsaccountlockedmessagetest)
10. [LoginWrongPasswordRegistersFailedAttemptReturnsRemainingAttemptsMessageTest](#loginwrongpasswordregistersfailedattemptreturnsremainingattemptsmessagetest)
11. [LoginUserLockedAfterFailedAttemptsNotifiesAdminTest](#loginuserlockedafterfailedattemptsnotifiesadmintest)
12. [LoginSuccessfulLoginReturnsTokenAndMessageTest](#loginsuccessfulloginreturnstokenandmessagetest)
13. [CreatePatientUserSuccessfullyCreatesPatientUserTest](#createpatientusersuccessfullycreatespatientusertest)
14. [RegisterPatientUserEmailIsAlreadyInUseTest](#registerpatientuseremailisalreadyinusetest)
15. [RegisterPatientUserPhoneNumberDoesNotMatchPatientTest](#registerpatientuserphonenumberdoesnotmatchpatienttest)
16. [ActivatePatientUserSuccessfullyActivatesPatientUserTest](#activatepatientusersuccessfullyactivatespatientusertest)
17. [ActivatePatientUserExpiredTokenTest](#activatepatientuserexpiredtokentest)
18. [ActivatePatientUserUserNotFoundTest](#activatepatientuserusernotfoundtest)
19. [RequestDeletePatientUserSuccessfullyTest](#requestdeletepatientusersuccessfullytest)
20. [RequestDeletePatientUserUserNotFoundTest](#requestdeletepatientuserusernotfoundtest)
21. [DeletePatientUserSuccessfullyTest](#deletepatientusersuccessfullytest)
22. [DeletePatientUserTokenExpiredTest](#deletepatientusertokenexpiredtest)
23. [RegisterUser_ShouldReturnOk_WhenUserIsCreated](#registeruser_shouldreturnok_whenuseriscreated)
24. [RegisterUser_ShouldReturnError_WhenStaffDoesNotExist](#registeruser_shouldreturnerror_whenstaffdoesnotexist)
25. [RegisterUser_ShouldReturnError_WhenUserDoesNotHavePermission](#registeruser_shouldreturnerror_whenuserdoesnothavepermission)
26. [RegisterUser_ShouldReturnError_WhenEmailAlreadyRegisted](#registeruser_shouldreturnerror_whenemailalreadyregisted)
27. [RegisterUser_ShouldReturnError_WhenUsernameAlreadyRegisted](#registeruser_shouldreturnerror_whenusernamealreadyregisted)
28. [RegisterPatientUser_ShouldReturnOk_WhenUserIsCreated](#registerpatientuser_shouldreturnok_whenuseriscreated)
29. [RegisterPatientUser_ShouldReturnError_WhenPatientDoesNotExist](#registerpatientuser_shouldreturnerror_whenpatientdoesnotexist)
30. [RegisterPatientUser_ShouldReturnError_WhenPhoneNumberDoesNotMatch](#registerpatientuser_shouldreturnerror_whenphonenumberdoesnotmatch)
31. [ActivatePatientUser_ShouldReturnOk_WhenUserIsActivated](#activatepatientuser_shouldreturnok_whenuserisactivated)
32. [ActivatePatientUser_ShouldReturnError_WhenUserIsNotPatient](#activatepatientuser_shouldreturnerror_whenuserisnotpatient)
33. [RequestDeleteUser_ShouldReturnOk_WhenRequestIsMade](#requestdeleteuser_shouldreturnok_whenrequestismade)
34. [RequestDeleteUser_ShouldReturnError_WhenUserIsNotPatient](#requestdeleteuser_shouldreturnerror_whenuserisnotpatient)
35. [DeleteUser_ShouldReturnOk_WhenUserIsDeleted](#deleteuser_shouldreturnok_whenuserisdeleted)
36. [DeleteUser_ShouldReturnError_WhenUserIsNotPatient](#deleteuser_shouldreturnerror_whenuserisnotpatient)
37. [DeleteUser_ShouldReturnError_WhenUserDoesNotExist](#deleteuser_shouldreturnerror_whenuserdoesnotexist)
38. [LoginUser_ShouldReturnOk](#loginuser_shouldreturnok)
39. [LoginUser_ShouldReturnError_UserNotActive](#loginuser_shouldreturnerror_usernotactive)
40. [LoginUser_ShouldReturnError_UserIsLocked](#loginuser_shouldreturnerror_userislocked)

## Test Descriptions

### CreateUserSuccessfullyTest

| **Purpose** | To verify that a user can be created successfully. |
|-------------|----------------------------------------------------|
| **Expected Result** | The user is created and all properties match the expected values. |
| **Type of Test** | Unit Test |

### CreateUserEmailIsAlreadyInUseTest

| **Purpose** | To verify that creating a user with an email that is already in use throws an exception. |
|-------------|----------------------------------------------------------------------------------------|
| **Expected Result** | An exception is thrown with the message "Email is already in use." |
| **Type of Test** | Unit Test |

### CreateUserUsernameIsAlreadyInUseTest

| **Purpose** | To verify that creating a user with a username that is already in use throws an exception. |
|-------------|-------------------------------------------------------------------------------------------|
| **Expected Result** | An exception is thrown with the message "Username is already in use." |
| **Type of Test** | Unit Test |

### ActivateUserExpiredTokenThrowsSecurityTokenExceptionTest

| **Purpose** | To verify that activating a user with an expired token throws a SecurityTokenException. |
|-------------|----------------------------------------------------------------------------------------|
| **Expected Result** | A SecurityTokenException is thrown with the message "Token validation failed." |
| **Type of Test** | Unit Test |

### ActivateUserInvalidPasswordThrowsArgumentExceptionTest

| **Purpose** | To verify that activating a user with an invalid password throws an ArgumentException. |
|-------------|---------------------------------------------------------------------------------------|
| **Expected Result** | An ArgumentException is thrown with the message "Password must be at least 10 characters long, include at least one digit, one uppercase letter, and one special character." |
| **Type of Test** | Unit Test |

### ActivateUserSuccessfullyActivatesUserTest

| **Purpose** | To verify that a user can be successfully activated. |
|-------------|------------------------------------------------------|
| **Expected Result** | The user is activated and the IsActive property is set to true. |
| **Type of Test** | Unit Test |

### LoginEmailNotRegisteredThrowsExceptionTest

| **Purpose** | To verify that logging in with an email that is not registered throws an exception. |
|-------------|-----------------------------------------------------------------------------------|
| **Expected Result** | An exception is thrown with the message "Email not registered." |
| **Type of Test** | Unit Test |

### LoginUserNotActiveReturnsUserNotActiveMessageTest

| **Purpose** | To verify that logging in with a user that is not active returns a user not active message. |
|-------------|-------------------------------------------------------------------------------------------|
| **Expected Result** | The message "User is not active. Check your Email to activate the account." is returned. |
| **Type of Test** | Unit Test |

### LoginUserLockedReturnsAccountLockedMessageTest

| **Purpose** | To verify that logging in with a user that is locked returns an account locked message. |
|-------------|----------------------------------------------------------------------------------------|
| **Expected Result** | The message "Your account is locked until {LockedUntil}. Please try again later." is returned. |
| **Type of Test** | Unit Test |

### LoginWrongPasswordRegistersFailedAttemptReturnsRemainingAttemptsMessageTest

| **Purpose** | To verify that logging in with a wrong password registers a failed attempt and returns the remaining attempts message. |
|-------------|----------------------------------------------------------------------------------------------------------------------|
| **Expected Result** | The message "Wrong password. You have {remaining attempts} attempts left before your account is locked." is returned. |
| **Type of Test** | Unit Test |

### LoginUserLockedAfterFailedAttemptsNotifiesAdminTest

| **Purpose** | To verify that logging in with a user that is locked after failed attempts notifies the admin. |
|-------------|-----------------------------------------------------------------------------------------------|
| **Expected Result** | The message "Your account has been locked due to multiple failed login attempts. Please try again in 30 minutes. An admin has been notified." is returned. |
| **Type of Test** | Unit Test |

### LoginSuccessfulLoginReturnsTokenAndMessageTest

| **Purpose** | To verify that a successful login returns a token and a success message. |
|-------------|-------------------------------------------------------------------------|
| **Expected Result** | The message "User logged in successfully" and a token are returned. |
| **Type of Test** | Unit Test |

### CreatePatientUserSuccessfullyCreatesPatientUserTest

| **Purpose** | To verify that a patient user can be created successfully. |
|-------------|------------------------------------------------------------|
| **Expected Result** | The patient user is created and a JWT token is returned. |
| **Type of Test** | Unit Test |

### RegisterPatientUserEmailIsAlreadyInUseTest

| **Purpose** | To verify that creating a patient user with an email that is already in use throws an exception. |
|-------------|------------------------------------------------------------------------------------------------|
| **Expected Result** | An exception is thrown with the message "Email is already in use." |
| **Type of Test** | Unit Test |

### RegisterPatientUserPhoneNumberDoesNotMatchPatientTest

| **Purpose** | To verify that creating a patient user with a phone number that does not match the patient's profile throws an exception. |
|-------------|------------------------------------------------------------------------------------------------------------------------|
| **Expected Result** | An exception is thrown with the message "Phone number does not match the Patient's profile with the given email." |
| **Type of Test** | Unit Test |

### ActivatePatientUserSuccessfullyActivatesPatientUserTest

| **Purpose** | To verify that a patient user can be successfully activated. |
|-------------|--------------------------------------------------------------|
| **Expected Result** | The patient user is activated and the IsActive property is set to true. |
| **Type of Test** | Unit Test |

### ActivatePatientUserExpiredTokenTest

| **Purpose** | To verify that activating a patient user with an expired token throws a SecurityTokenException. |
|-------------|------------------------------------------------------------------------------------------------|
| **Expected Result** | A SecurityTokenException is thrown with the message "Token validation failed." |
| **Type of Test** | Unit Test |

### ActivatePatientUserUserNotFoundTest

| **Purpose** | To verify that activating a patient user with a token for a non-existent user returns null. |
|-------------|--------------------------------------------------------------------------------------------|
| **Expected Result** | Null is returned. |
| **Type of Test** | Unit Test |

### RequestDeletePatientUserSuccessfullyTest

| **Purpose** | To verify that a delete request for a patient user is processed successfully. |
|-------------|------------------------------------------------------------------------------|
| **Expected Result** | The delete request is processed and an email is sent to the user. |
| **Type of Test** | Unit Test |

### RequestDeletePatientUserUserNotFoundTest

| **Purpose** | To verify that a delete request for a non-existent patient user throws an exception. |
|-------------|-------------------------------------------------------------------------------------|
| **Expected Result** | An exception is thrown with the message "User not found." |
| **Type of Test** | Unit Test |

### DeletePatientUserSuccessfullyTest

| **Purpose** | To verify that a patient user can be deleted successfully. |
|-------------|------------------------------------------------------------|
| **Expected Result** | The patient user is deleted and a log entry is created. |
| **Type of Test** | Unit Test |

### DeletePatientUserTokenExpiredTest

| **Purpose** | To verify that deleting a patient user with an expired token throws a SecurityTokenException. |
|-------------|----------------------------------------------------------------------------------------------|
| **Expected Result** | A SecurityTokenException is thrown with the message "Token validation failed." |
| **Type of Test** | Unit Test |

### RegisterUser_ShouldReturnOk_WhenUserIsCreated

| **Purpose** | To verify that a user can be created successfully via the API. |
|-------------|----------------------------------------------------------------|
| **Expected Result** | The user is created and the response status is OK. |
| **Type of Test** | Integration Test |

### RegisterUser_ShouldReturnError_WhenStaffDoesNotExist

| **Purpose** | To verify that creating a user with a non-existent staff ID returns an error. |
|-------------|------------------------------------------------------------------------------|
| **Expected Result** | The response status is InternalServerError. |
| **Type of Test** | Integration Test |

### RegisterUser_ShouldReturnError_WhenUserDoesNotHavePermission

| **Purpose** | To verify that creating a user without proper permissions returns an error. |
|-------------|----------------------------------------------------------------------------|
| **Expected Result** | The response status is Unauthorized. |
| **Type of Test** | Integration Test |

### RegisterUser_ShouldReturnError_WhenEmailAlreadyRegisted

| **Purpose** | To verify that creating a user with an already registered email returns an error. |
|-------------|---------------------------------------------------------------------------------|
| **Expected Result** | The response status is InternalServerError. |
| **Type of Test** | Integration Test |

### RegisterUser_ShouldReturnError_WhenUsernameAlreadyRegisted

| **Purpose** | To verify that creating a user with an already registered username returns an error. |
|-------------|------------------------------------------------------------------------------------|
| **Expected Result** | The response status is InternalServerError. |
| **Type of Test** | Integration Test |

### RegisterPatientUser_ShouldReturnOk_WhenUserIsCreated

| **Purpose** | To verify that a patient user can be created successfully via the API. |
|-------------|------------------------------------------------------------------------|
| **Expected Result** | The patient user is created and the response status is OK. |
| **Type of Test** | Integration Test |

### RegisterPatientUser_ShouldReturnError_WhenPatientDoesNotExist

| **Purpose** | To verify that creating a patient user with a non-existent patient ID returns an error. |
|-------------|---------------------------------------------------------------------------------------|
| **Expected Result** | The response status is NotFound. |
| **Type of Test** | Integration Test |

### RegisterPatientUser_ShouldReturnError_WhenPhoneNumberDoesNotMatch

| **Purpose** | To verify that creating a patient user with a mismatched phone number returns an error. |
|-------------|---------------------------------------------------------------------------------------|
| **Expected Result** | The response status is InternalServerError. |
| **Type of Test** | Integration Test |

### ActivatePatientUser_ShouldReturnOk_WhenUserIsActivated

| **Purpose** | To verify that a patient user can be activated successfully via the API. |
|-------------|--------------------------------------------------------------------------|
| **Expected Result** | The patient user is activated and the response status is OK. |
| **Type of Test** | Integration Test |

### ActivatePatientUser_ShouldReturnError_WhenUserIsNotPatient

| **Purpose** | To verify that activating a non-patient user returns an error. |
|-------------|---------------------------------------------------------------|
| **Expected Result** | The response status is NotFound. |
| **Type of Test** | Integration Test |

### RequestDeleteUser_ShouldReturnOk_WhenRequestIsMade

| **Purpose** | To verify that a delete request for a user is processed successfully via the API. |
|-------------|----------------------------------------------------------------------------------|
| **Expected Result** | The delete request is processed and the response status is OK. |
| **Type of Test** | Integration Test |

### RequestDeleteUser_ShouldReturnError_WhenUserIsNotPatient

| **Purpose** | To verify that a delete request for a non-patient user returns an error. |
|-------------|-------------------------------------------------------------------------|
| **Expected Result** | The response status is Forbidden. |
| **Type of Test** | Integration Test |

### DeleteUser_ShouldReturnOk_WhenUserIsDeleted

| **Purpose** | To verify that a user can be deleted successfully via the API. |
|-------------|---------------------------------------------------------------|
| **Expected Result** | The user is deleted and the response status is OK. |
| **Type of Test** | Integration Test |

### DeleteUser_ShouldReturnError_WhenUserIsNotPatient

| **Purpose** | To verify that deleting a non-patient user returns an error. |
|-------------|--------------------------------------------------------------|
| **Expected Result** | The response status is Forbidden. |
| **Type of Test** | Integration Test |

### DeleteUser_ShouldReturnError_WhenUserDoesNotExist

| **Purpose** | To verify that deleting a non-existent user returns an error. |
|-------------|---------------------------------------------------------------|
| **Expected Result** | The response status is InternalServerError. |
| **Type of Test** | Integration Test |

### LoginUser_ShouldReturnOk

| **Purpose** | To verify that a user can log in successfully via the API. |
|-------------|-----------------------------------------------------------|
| **Expected Result** | The user logs in and the response status is OK. |
| **Type of Test** | Integration Test |

### LoginUser_ShouldReturnError_UserNotActive

| **Purpose** | To verify that logging in with an inactive user returns an error. |
|-------------|------------------------------------------------------------------|
| **Expected Result** | The response status is InternalServerError. |
| **Type of Test** | Integration Test |

### LoginUser_ShouldReturnError_UserIsLocked

| **Purpose** | To verify that logging in with a locked user returns an error. |
|-------------|---------------------------------------------------------------|
| **Expected Result** | The response status is Forbidden. |
| **Type of Test** | Integration Test |