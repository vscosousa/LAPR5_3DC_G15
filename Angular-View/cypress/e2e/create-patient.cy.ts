describe('Create Patient Page', () => {
  const uniqueId = Date.now();
  const uniqueEmail = `test.patient${uniqueId}@example.com`;
  const uniquePhoneNumber = `23456789${uniqueId}`;

  beforeEach(() => {
    cy.loginAsAdmin('admin@email.com', 'Adminadmin1@');
    cy.visit('/create-patient');
  });

  it('should display the create patient form', () => {
    cy.get('.create-title').should('contain', 'Create Patient');
    cy.get('form.create-form').should('be.visible');
  });

  it('should allow the user to fill out the form and create a new patient', () => {
    cy.get('input[name="firstName"]').type(`Test${uniqueId}`);
    cy.get('input[name="lastName"]').type(`Patient${uniqueId}`);
    cy.get('input[name="fullName"]').type(`Test Patient${uniqueId}`);
    cy.get('input[name="dateOfBirth"]').type('1990-01-01');
    cy.get('select[name="genderOptions"]').select('Male');
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="phoneNumber"]').type(`+1${uniquePhoneNumber}`);
    cy.get('input[name="emergencyContact"]').type(`+123456788${uniqueId}`);

    cy.get('button.btn-create').click();

    cy.url().should('include', '/manage-patients');
    cy.get('.table-container .table tbody').should('contain', `Test Patient${uniqueId}`);
  });

  it('should clear the form when the clear button is clicked', () => {
    cy.get('input[name="firstName"]').type(`Test${uniqueId}`);
    cy.get('input[name="lastName"]').type(`Patient${uniqueId}`);
    cy.get('input[name="fullName"]').type(`Test Patient${uniqueId}`);
    cy.get('input[name="dateOfBirth"]').type('1990-01-01');
    cy.get('select[name="genderOptions"]').select('Male');
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="phoneNumber"]').type(`+1${uniquePhoneNumber}`);
    cy.get('input[name="emergencyContact"]').type(`+123456788${uniqueId}`);

    cy.get('button.btn-clear').click();

    cy.get('input[name="firstName"]').should('have.value', '');
    cy.get('input[name="lastName"]').should('have.value', '');
    cy.get('input[name="fullName"]').should('have.value', '');
    cy.get('input[name="dateOfBirth"]').should('have.value', '');
    cy.get('select[name="genderOptions"]').should('have.value', '');
    cy.get('input[name="email"]').should('have.value', '');
    cy.get('input[name="phoneNumber"]').should('have.value', '');
    cy.get('input[name="emergencyContact"]').should('have.value', '');
    cy.get('textarea[name="medicalConditions"]').should('have.value', '');
  });
});
