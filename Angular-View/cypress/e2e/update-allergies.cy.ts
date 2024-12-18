describe('Update Allergy Page', () => {
  const uniqueAllergyCode = `A1A.${Math.floor(Math.random() * 100)}`;
  const uniqueAllergyName = `Test`;
  const uniqueAllergyDescription = `Description`;
  const uniqueAllergySymptoms = `Symptoms`;

  before(() => {
    cy.loginAsAdmin('admin@email.com', 'Adminadmin1@');
    cy.createAllergy({
      allergyCode: uniqueAllergyCode,
      allergyName: uniqueAllergyName,
      allergyDescription: uniqueAllergyDescription,
      allergySymptoms: uniqueAllergySymptoms
    });
  });

  beforeEach(() => {
    cy.loginAsAdmin('admin@email.com', 'Adminadmin1@');
    cy.visit('/manage-allergies-and-conditions');
  });

  it('should display the update allergy form', () => {
    cy.contains('tr', uniqueAllergyName).within(() => {
      cy.get('button.btn-view').contains('Update').click();
    });
    cy.get('h2').should('contain', 'Update Allergy');
    cy.get('form').should('be.visible');
  });

  it('should allow the user to update allergy details', () => {
    cy.contains('tr', uniqueAllergyName).within(() => {
      cy.get('button.btn-view').contains('Update').click();
    });
    cy.get('input[name="allergy-code"]').should('have.value', uniqueAllergyCode);
    cy.get('input[name="allergy-name"]').clear().type(`Updated Test Allergy`);
    cy.get('input[name="allergy-description"]').clear().type(`Updated Description`);
    cy.get('input[name="allergy-symptoms"]').clear().type(`Updated Symptoms`);

    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/manage-allergies-and-conditions');
    cy.get('.table-container .table tbody').should('contain', `Updated Test Allergy`);
  });

  it('should display an alert with the message: Failed to create allergy', () => {
    cy.contains('tr', uniqueAllergyName).within(() => {
      cy.get('button.btn-view').contains('Update').click();
    });
    cy.get('input[name="allergy-name"]').clear();
    cy.get('input[name="allergy-description"]').clear();

    cy.get('button[type="submit"]').click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('Failed to update allergy.');
    });
  });
});
