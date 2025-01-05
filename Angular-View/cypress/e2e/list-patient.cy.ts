describe('Manage Patients Page', () => {
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
  });

  beforeEach(() => {
    cy.loginAsAdmin('admin@email.com', 'Adminadmin1@');
    cy.visit('/manage-patients');
  });

  it('should display the list of patients', () => {
    cy.get('.manage-title').should('contain', 'Patients Manager');
    cy.get('.table-container .table tbody').should('contain', `Test Patient${uniqueId}`);
  });

  it('should allow the user to apply filters', () => {
    cy.get('input[name="firstName"]').type(`Test${uniqueId}`);
    cy.get('input[name="lastName"]').type(`Patient${uniqueId}`);
    cy.get('input[name="fullName"]').type(`Test Patient${uniqueId}`);
    cy.get('input[name="dateOfBirth"]').type('1990-01-01');
    cy.get('select[name="gender"]').select('Male');
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="phoneNumber"]').type(`+1${uniquePhoneNumber}`);

    cy.get('button.btn-filter').click();
    cy.wait(3000);

    cy.get('.table-container .table tbody').should('contain', `Test Patient${uniqueId}`);
  });

  it('should clear the filters when the clear button is clicked', () => {
    cy.get('input[name="firstName"]').type(`Test${uniqueId}`);
    cy.get('input[name="lastName"]').type(`Patient${uniqueId}`);
    cy.get('input[name="fullName"]').type(`Test Patient${uniqueId}`);
    cy.get('input[name="dateOfBirth"]').type('1990-01-01');
    cy.get('select[name="gender"]').select('Male');
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="phoneNumber"]').type(`+1${uniquePhoneNumber}`);

    cy.get('button.btn-clear').click();

    cy.get('input[name="firstName"]').should('have.value', '');
    cy.get('input[name="lastName"]').should('have.value', '');
    cy.get('input[name="fullName"]').should('have.value', '');
    cy.get('input[name="dateOfBirth"]').should('have.value', '');
    cy.get('select[name="gender"]').should('have.value', '');
    cy.get('input[name="email"]').should('have.value', '');
    cy.get('input[name="phoneNumber"]').should('have.value', '');
  });
});
