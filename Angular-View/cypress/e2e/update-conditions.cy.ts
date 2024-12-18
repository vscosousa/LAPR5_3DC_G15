describe('Update Condition Page', () => {
  const uniqueConditionCode = `A1A.${Math.floor(Math.random() * 100)}`;
  const uniqueConditionName = `Test Condition`;
  const uniqueConditionDescription = `Condition Description`;
  const uniqueConditionSymptoms = `Condition Symptoms`;

  before(() => {
    cy.loginAsAdmin('admin@email.com', 'Adminadmin1@');
    cy.createCondition({
      conditionCode: uniqueConditionCode,
      conditionName: uniqueConditionName,
      conditionDescription: uniqueConditionDescription,
      conditionSymptoms: uniqueConditionSymptoms
    });
  });

  beforeEach(() => {
    cy.loginAsAdmin('admin@email.com', 'Adminadmin1@');
    cy.visit('/manage-allergies-and-conditions');
  });

  it('should display the update condition form', () => {
    cy.contains('tr', uniqueConditionName).within(() => {
      cy.get('button.btn-view').contains('Update').click();
    });
    cy.get('h2').should('contain', 'Update Condition');
    cy.get('form').should('be.visible');
  });

  it('should allow the user to update condition details', () => {
    cy.contains('tr', uniqueConditionName).within(() => {
      cy.get('button.btn-view').contains('Update').click();
    });
    cy.get('input[name="medicalCondition-code"]').should('have.value', uniqueConditionCode);
    cy.get('input[name="medicalCondition-name"]').clear().type(`Updated Test Condition`);
    cy.get('input[name="medicalCondition-description"]').clear().type(`Updated Condition Description`);
    cy.get('input[name="medicalCondition-symptoms"]').clear().type(`Updated Condition Symptoms`);

    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/manage-allergies-and-conditions');
    cy.get('.table-container .table tbody').should('contain', `Updated Test Condition`);
  });

  it('should display an alert with the message: Failed to update condition', () => {
    cy.contains('tr', uniqueConditionName).within(() => {
      cy.get('button.btn-view').contains('Update').click();
    });
    cy.get('input[name="medicalCondition-name"]').clear();
    cy.get('input[name="medicalCondition-description"]').clear();

    cy.get('button[type="submit"]').click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('Failed to update condition.');
    });
  });
});
