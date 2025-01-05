describe('Patient Settings Page', () => {
  const uniqueId = Date.now();
  const uniqueEmail = `test.patient${uniqueId}@example.com`;
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

    cy.get('.sidebar a').contains('Logout').click();
    cy.get('.buttons a').contains('Register').click();

    cy.get('input[id="email"]').type(uniqueEmail);
    cy.get('input[id="identifier"]').type('+1');
    cy.get('input[id="phone"]').type(uniquePhoneNumber);
    cy.get('input[id="password"]').type('Newuser1@');
    cy.get('input[id="confirm-password"]').type('Newuser1@');

    cy.get('form').submit();

    cy.url().should('include', '/login');

    cy.window().then((window) => {
      cy.wait(1000);
      const token = window.localStorage.getItem('authToken');
      console.log('LocalStorage contents:', window.localStorage);
      if (!token) {
        throw new Error('Token not found');
      }
      cy.activatePatientAccount(token);
    });
  });

  beforeEach(() => {
    cy.loginAsPatient(uniqueEmail, 'Newuser1@');
    cy.visit('/patient-settings');
  });

  it('should display the settings page', () => {
    cy.get('.settings-container').should('be.visible');
  });

  it('should allow the user to change the theme', () => {
    cy.get('input[name="theme"][value="light"]').check();
    cy.get('input[name="theme"][value="light"]').should('be.checked');
    cy.get('input[name="theme"][value="dark"]').check();
    cy.get('input[name="theme"][value="dark"]').should('be.checked');
  });

  it('should display the account settings section', () => {
    cy.get('#account-settings').should('be.visible');
  });

  it('should allow the user to request account deletion', () => {
    cy.get('.delete-account').click();

    cy.on('window:alert', (text) => {
      expect(text).to.contains('To complete the account deletion process, please check your email for further instructions.');
    });

    cy.url().should('include', '/login');

    cy.window().then((win) => {
      cy.wait(1000);
      expect(win.localStorage.getItem('token')).to.be.null;
    });
  });

  it('should delete the account', () => {
    cy.window().then((win) => {
      const token = win.localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      cy.visit(`/delete-user?token=${token}`);
      cy.get('.delete-button').click();

      cy.on('window:alert', (text) => {
        expect(text).to.contains('Your account has been successfully deleted.');
      });

      cy.url().should('include', '/');
    });
  });
});
