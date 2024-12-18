describe('Medical History Manager', () => {
  const uniqueId = Date.now();
  const uniqueEmail = `test.patient${uniqueId}@example.com`;
  const uniqueFullNamme = `Test Patient${uniqueId}`
  const uniquePhoneNumber = `23456789${uniqueId}`;

  before(() => {
    cy.loginAsAdmin('admin@email.com', 'Adminadmin1@');
    cy.createPatient({
      firstName: `Test${uniqueId}`,
      lastName: `Patient${uniqueId}`,
      fullName: uniqueFullNamme,
      dateOfBirth: '1990-01-01',
      genderOptions: '1',
      email: uniqueEmail,
      phoneNumber: `+1${uniquePhoneNumber}`,
      emergencyContact: `+123456788${uniqueId}`,
    });
  });

  it('should filter by email, select the patient and edit medical history', () => {
    cy.loginAsDoctor('carlamatos@gmail.com', 'Doctor1234+');

    cy.visit('/medical-history-manager');

    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('button.btn-filter').click();

    cy.contains('tr', uniqueFullNamme).within(() => {
      cy.get('a.btn-update').click();
    });

    cy.get('textarea[name="freeTextField"]').clear().type('Updated Free Text');
    cy.get('button.btn-save').click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('Medical history updated successfully');
    });
  });
});
