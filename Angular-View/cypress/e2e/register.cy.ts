describe('Register Page', () => {
  const uniqueId = Date.now();
  const uniqueEmail = `test.patient${uniqueId}@example.com`
  const uniquePhoneNumber = `23456789${uniqueId}`;
  before(() => {
    cy.loginAsAdmin('admin@email.com', 'Adminadmin1@');

    cy.createPatient({
      firstName: `Test${uniqueId}`,
      lastName: `Patient${uniqueId}`,
      fullName: `Test Patient${uniqueId}`,
      dateOfBirth: '1990-01-01',
      genderOptions: '1',
      email: uniqueEmail,
      phoneNumber: `+1${uniquePhoneNumber}`,
      emergencyContact: `+123456788${uniqueId}`,
    });
  });

  beforeEach(() => {
    cy.visit('/register');
  });

  it('should display the registration form', () => {
    cy.get('form').should('be.visible');
  });

  it('should allow the user to register with valid credentials', () => {
    cy.get('input[id="email"]').type(uniqueEmail);
    cy.get('input[id="identifier"]').type('+1');
    cy.get('input[id="phone"]').type(uniquePhoneNumber);
    cy.get('input[id="password"]').type('Newuser1@');
    cy.get('input[id="confirm-password"]').type('Newuser1@');

    cy.get('form').submit();

    cy.url().should('include', '/login');
  });

  it('should display an error message for invalid registration', () => {
    cy.get('input[id="email"]').type('invalidemail@gmail.com');
    cy.get('input[id="identifier"]').type('+1');
    cy.get('input[id="phone"]').type('123456789');
    cy.get('input[id="password"]').type('short');
    cy.get('input[id="confirm-password"]').type('short');

    cy.get('form').submit();

    cy.on('window:alert', (text) => {
      expect(text).to.contains('Registration failed - There is no patient with the provided email registered in the system.');
    });
  });

  it('should toggle password visibility', () => {
    cy.get('input[id="password"]').should('have.attr', 'type', 'password');

    cy.get('input[id="password"] + .eye-icon').click();

    cy.get('input[id="password"]').should('have.attr', 'type', 'text');

    cy.get('input[id="password"] + .eye-icon').click();

    cy.get('input[id="password"]').should('have.attr', 'type', 'password');
  });

  it('should toggle confirm password visibility', () => {
    cy.get('input[id="confirm-password"]').should('have.attr', 'type', 'password');

    cy.get('input[id="confirm-password"] + .eye-icon').click();

    cy.get('input[id="confirm-password"]').should('have.attr', 'type', 'text');

    cy.get('input[id="confirm-password"] + .eye-icon').click();

    cy.get('input[id="confirm-password"]').should('have.attr', 'type', 'password');
  });
});
