describe('Manage Patients Page - Delete Patient', () => {
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

  it('should display the list of patients', () => {
    cy.get('.manage-title').should('contain', 'Patients Manager');
    cy.get('.table-container .table tbody').should('contain', `Test Patient${uniqueId}`);
  });

  it('should delete a patient when the delete button is clicked', () => {
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('button.btn-filter').click();
    cy.wait(2000);
    cy.get('.table-container .table tbody tr').first().find('.btn-delete').click();

    cy.on('window:confirm', () => true);

    cy.wait(2000);
    cy.get('.table-container .table tbody').should('not.contain', `Test Patient${uniqueId}`);
  });
});
