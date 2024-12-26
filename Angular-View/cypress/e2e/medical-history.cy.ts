describe('Medical History Manager', () => {
  const uniqueId = Date.now();
  const uniqueEmail = `test.patient${uniqueId}@example.com`;
  const uniqueFullName = `Test Patient${uniqueId}`;
  const uniquePhoneNumber = `23456789${uniqueId}`;

  before(() => {
    cy.loginAsAdmin('admin@email.com', 'Adminadmin1@');
    cy.createPatient({
      firstName: `Test${uniqueId}`,
      lastName: `Patient${uniqueId}`,
      fullName: uniqueFullName,
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

    cy.contains('tr', uniqueFullName).within(() => {
      cy.get('a.btn-update').click();
    });

    cy.get('textarea[name="freeTextField"]').clear().type('Updated Free Text');

    // Select the first allergy if available
    cy.get('.multi-select-list').first().within(() => {
      cy.get('input[type="checkbox"]').first().check();
    });

    // Select the first medical condition if available
    cy.get('.multi-select-list').last().within(() => {
      cy.get('input[type="checkbox"]').first().check();
    });

    cy.get('button.btn-save').click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('Medical history updated successfully');
    });
  });

  it('should view the medical history of a patient', () => {
    cy.loginAsDoctor('carlamatos@gmail.com', 'Doctor1234+');

    cy.visit('/medical-history-manager');

    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('button.btn-filter').click();

    cy.contains('tr', uniqueFullName).within(() => {
      cy.get('a.btn-view').click();
    });

    cy.get('button.btn-view').contains('View Medical History').click();

    cy.get('.modal-content').should('be.visible');
    cy.get('.modal-content').within(() => {
      cy.contains('Free Text').next().should('contain', 'Updated Free Text');
      cy.contains('Allergies').next().should('not.contain', 'No allergies');
      cy.contains('Medical Conditions').next().should('not.contain', 'No medical conditions');
    });

    cy.get('.close').click();
    cy.get('.modal-content').should('not.exist');
  });

  it('should clear filters', () => {
    cy.loginAsDoctor('carlamatos@gmail.com', 'Doctor1234+');

    cy.visit('/medical-history-manager');

    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('button.btn-clear').click();

    cy.get('input[name="email"]').should('have.value', '');
  });
});