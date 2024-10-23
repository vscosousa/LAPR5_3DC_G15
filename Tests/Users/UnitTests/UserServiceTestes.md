# User Tests

This document provides an overview of the tests related to the User Requirements. The tests are divided into three types: **Unit Tests**, **Integration Tests**, and **End-to-End Tests**.

## Summary

The following is a summary of the number of tests for each service method:

- **CreateUser**: 3 tests
- **ActivateUser**: 3 tests
- **Login**: 6 tests

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