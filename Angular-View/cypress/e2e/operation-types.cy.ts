describe('Operation Types Page', () => {
  beforeEach(() => {
    //login before each test
    cy.visit ('/login');
    cy.get('input[id="email"]').type('admin@email.com');
    cy.get('input[id="password"]').type('Adminadmin1@');
    cy.get('form').submit();
    cy.url().should('include', '/panel-admin');
    cy.visit('/operation-types');
  });

  it('should display the operation types table', () => {
    // Check if the operation types table is displayed
    cy.get('.table').should('be.visible');
  });

  it('should display the correct table headers', () => {
    // Check if the table headers are correct
    cy.get('th').eq(0).should('contain', 'Operation Type');
    cy.get('th').eq(1).should('contain', 'Estimated Time');
    cy.get('th').eq(2).should('contain', 'Specialization');
    cy.get('th').eq(3).should('contain', 'Staff Members');
    cy.get('th').eq(4).should('contain', 'Actions');
  });

  it('should allow the admin to create a new operation type', () => {
    // Click the create button
    cy.get('.btn-create').click();

    // Check if the URL includes '/create-operation-type'
    cy.url().should('include', '/create-operation-type');
  });

  it('should display staff members when "Show Staff" button is clicked', () => {
    // Click the "Show Staff" button for the first specialization
    cy.get('.btn-info').first().click();

    // Check if the staff members are displayed
    cy.get('.staff-members').first().should('be.visible');
  });

  it('should allow the admin to edit an operation type', () => {
    // Click the edit button for the first operation type
    cy.get('.btn-update').first().click();

    // Check if the URL includes '/update-operation-type'
    cy.url().should('include', '/update-operation-type');
  });

  it('should allow the admin to deactivate and activate an operation type', () => {
    // Click the deactivate button for the first operation type
    cy.get('.btn-delete').first().click();

    // Check if the deactivate button is replaced with the activate button
    cy.get('.btn-activate').first().should('be.visible');

    // Click the activate button for the first operation type
    cy.get('.btn-activate').first().click();

    // Check if the activate button is replaced with the deactivate button
    cy.get('.btn-delete').first().should('be.visible');
  });

  it('should navigate back to the dashboard', () => {
    // Click the back button
    cy.get('.btn-back').click();

    // Check if the URL includes '/panel-admin'
    cy.url().should('include', '/panel-admin');
  });
});