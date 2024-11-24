describe('Update Operation Request Page', () => {
    let operationRequestId: number;
  
    beforeEach(() => {
      // login before each test
      cy.visit('/login');
      cy.get('input[id="email"]').type('admin@email.com');
      cy.get('input[id="password"]').type('Adminadmin1@');
      cy.get('form').submit();
      cy.url().should('include', '/panel-admin');
  
      // Generate a unique numeric ID using a timestamp
      operationRequestId = Date.now();
  
      // Create a new operation type to ensure it exists in the database
      cy.visit('/create-operation-type');
      cy.get('input[id="id"]').type(String(operationRequestId));
      cy.get('input[id="estimatedTime"]').type('2 hours');
      cy.get('input[type="checkbox"]').first().check();
      cy.get('form').submit();
      cy.url().should('include', '/operation-types');
  
      // Visit the update operation type page for the newly created operation type
      cy.visit(`/update-operation-type/${operationRequestId}`);
    });
  
    it('should display the update operation type form', () => {
      // Check if the update operation type form is displayed
      cy.get('form').should('be.visible');
    });
  
    it('should allow the admin to fill in the form and update the operation request', () => {
      // Fill in the name field
      cy.get('input[id="name"]').clear().type('Updated Operation Request');
  
      // Fill in the deadline date field
      cy.get('input[id="deadlineDate"]').clear().type('2023-12-31');
  
      // Add a new request type
      cy.get('.btn-addRequestType').click();
      cy.get('input[placeholder="Request Type"]').last().type('New Request Type');
  
      // Submit the form
      cy.get('form').submit();
  
      // Check if the URL includes '/operation-requests'
      cy.url().should('include', '/operation-requests');
    });
  
    it('should navigate back to the operation types page', () => {
      // Click the cancel button
      cy.get('.btn-secondary').click();
  
      // Check if the URL includes '/operation-types'
      cy.url().should('include', '/operation-types');
    });
  });