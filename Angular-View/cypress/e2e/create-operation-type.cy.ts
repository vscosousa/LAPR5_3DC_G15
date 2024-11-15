describe('Create Operation Type Page', () => {
  beforeEach(() => {
    // login before each test
    cy.visit('/login');
    cy.get('input[id="email"]').type('admin@email.com');
    cy.get('input[id="password"]').type('Adminadmin1@');
    cy.get('form').submit();
    cy.url().should('include', '/panel-admin');
    cy.visit('/create-operation-type');
  });

  it('should display the create operation type form', () => {
    // Check if the create operation type form is displayed
    cy.get('form').should('be.visible');
  });

  it('should allow the admin to fill in the form and create a new operation type', () => {
    // Generate a unique name using a timestamp
    const uniqueName = `New Operation Type ${Date.now()}`;

    // Fill in the name field
    cy.get('input[id="name"]').type(uniqueName);

    // Fill in the estimated time field
    cy.get('input[id="estimatedTime"]').type('2 hours');

    // Select available specializations
    cy.get('input[type="checkbox"]').first().check();

    // Submit the form
    cy.get('form').submit();

    // Check if the URL includes '/operation-types'
    cy.url().should('include', '/operation-types');
  });

  it('should display an error message when no specialization is selected', () => {
    // Generate a unique name using a timestamp
    const uniqueName = `New Operation Type ${Date.now()}`;

    // Fill in the name field
    cy.get('input[id="name"]').type(uniqueName);

    // Fill in the estimated time field
    cy.get('input[id="estimatedTime"]').type('2 hours');

    // Submit the form without selecting any specializations
    cy.get('form').submit();

    // Check if the error message is displayed
    cy.get('.error-message').should('be.visible').and('contain', 'You must add at least one specialization to the operation type.');
  });

  it('should navigate back to the operation types page', () => {
    // Click the back button
    cy.get('.btn-back').click();

    // Check if the URL includes '/operation-types'
    cy.url().should('include', '/operation-types');
  });
});