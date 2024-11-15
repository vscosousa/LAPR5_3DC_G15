describe('Update Operation Type Page', () => {
  let operationTypeName: string;

  beforeEach(() => {
    // login before each test
    cy.visit('/login');
    cy.get('input[id="email"]').type('admin@email.com');
    cy.get('input[id="password"]').type('Adminadmin1@');
    cy.get('form').submit();
    cy.url().should('include', '/panel-admin');

    // Generate a unique name using a timestamp
    operationTypeName = `Operation Type ${Date.now()}`;

    // Create a new operation type to ensure it exists in the database
    cy.visit('/create-operation-type');
    cy.get('input[id="name"]').type(operationTypeName);
    cy.get('input[id="estimatedTime"]').type('2 hours');
    cy.get('input[type="checkbox"]').first().check();
    cy.get('form').submit();
    cy.url().should('include', '/operation-types');

    // Visit the update operation type page for the newly created operation type
    cy.visit(`/update-operation-type/${operationTypeName}`);
  });

  it('should display the update operation type form', () => {
    // Check if the update operation type form is displayed
    cy.get('form').should('be.visible');
  });

  it('should allow the admin to fill in the form and update the operation type', () => {
    // Fill in the name field
    cy.get('input[id="name"]').clear().type('Updated Operation Type');

    // Fill in the estimated duration field
    cy.get('input[id="estimatedDuration"]').clear().type('3 hours');

    // Add a new specialization
    cy.get('.btn-addSpecialization').click();
    cy.get('input[placeholder="Specialization"]').last().type('Doctor');

    // Submit the form
    cy.get('form').submit();

    // Check if the URL includes '/operation-types'
    cy.url().should('include', '/operation-types');
  });

  it('should navigate back to the operation types page', () => {
    // Click the cancel button
    cy.get('.btn-secondary').click();

    // Check if the URL includes '/operation-types'
    cy.url().should('include', '/operation-types');
  });
});