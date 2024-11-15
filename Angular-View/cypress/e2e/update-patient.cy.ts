describe('Update Patient Page', () => {
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
      medicalConditions: 'None'
    });
  });

  beforeEach(() => {
    cy.loginAsAdmin('admin@email.com', 'Adminadmin1@');
    cy.visit('/manage-patients');
  });

  it('should display the update patient form', () => {
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('button.btn-filter').click();
    cy.wait(2000);
    cy.get('.table-container .table tbody tr').first().find('.btn-update').click();
    cy.get('.update-title').should('contain', 'Update Patient');
    cy.get('form.update-form').should('be.visible');
  });

  it('should allow the user to update patient details', () => {
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('button.btn-filter').click();
    cy.wait(3000);
    cy.get('.table-container .table tbody tr').first().find('.btn-update').click();
    cy.get('input[name="firstName"]').clear().type(`UpdatedTest${uniqueId}`);
    cy.get('input[name="lastName"]').clear().type(`UpdatedPatient${uniqueId}`);
    cy.get('input[name="fullName"]').clear().type(`Updated Test Patient${uniqueId}`);
    cy.get('input[name="email"]').clear().type(`updated.${uniqueEmail}`);
    cy.get('input[name="phoneNumber"]').clear().type(`+123456789${uniqueId}`);
    cy.get('input[name="emergencyContact"]').clear().type(`+123456780${uniqueId}`);
    cy.get('textarea[name="medicalConditions"]').clear().type('Updated Conditions');

    cy.get('button.btn-update').click();

    cy.url().should('include', '/manage-patients');
    cy.get('.table-container .table tbody').should('contain', `Updated Test Patient${uniqueId}`);
  });

  it('should clear the form when the clear button is clicked', () => {
    cy.get('.table-container .table tbody tr').first().find('.btn-update').click();
    cy.get('input[name="firstName"]').clear().type(`UpdatedTest${uniqueId}`);
    cy.get('input[name="lastName"]').clear().type(`UpdatedPatient${uniqueId}`);
    cy.get('input[name="fullName"]').clear().type(`Updated Test Patient${uniqueId}`);
    cy.get('input[name="email"]').clear().type(`updated.${uniqueEmail}`);
    cy.get('input[name="phoneNumber"]').clear().type(`+123456789${uniqueId}`);
    cy.get('input[name="emergencyContact"]').clear().type(`+123456780${uniqueId}`);
    cy.get('textarea[name="medicalConditions"]').clear().type('Updated Conditions');

    cy.get('button.btn-clear').click();

    cy.get('input[name="firstName"]').should('have.value', '');
    cy.get('input[name="lastName"]').should('have.value', '');
    cy.get('input[name="fullName"]').should('have.value', '');
    cy.get('input[name="email"]').should('have.value', '');
    cy.get('input[name="phoneNumber"]').should('have.value', '');
    cy.get('input[name="emergencyContact"]').should('have.value', '');
    cy.get('textarea[name="medicalConditions"]').should('have.value', '');
  });
});
