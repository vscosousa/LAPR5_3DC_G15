describe('Login Page', () => {
    beforeEach(() => {
      // Visit the login page before each test
      cy.visit('/login');
    });
  
    it('should display the login form', () => {
      // Check if the login form is displayed
      cy.get('form').should('be.visible');
    });
  
    it('should allow the user to login with valid credentials', () => {
      // Fill in the email and password fields
      cy.get('input[id="email"]').type('admin@email.com');
      cy.get('input[id="password"]').type('Adminadmin1@');
  
      // Submit the form
      cy.get('form').submit();
  
      // Check if the user is redirected to the dashboard
      cy.url().should('include', '/panel-admin');
    });
  
    it('should display an error message for invalid credentials', () => {
      // Fill in the email and password fields with invalid credentials
      cy.get('input[id="email"]').type('invalid@email.com');
      cy.get('input[id="password"]').type('wrongpassword');
  
      // Submit the form
      cy.get('form').submit();
  
      // Check if an error message is displayed
      cy.get('.error-message').should('be.visible').and('contain', 'Invalid email or password');
    });
  
    it('should toggle password visibility', () => {
      // Check initial password field type
      cy.get('input[id="password"]').should('have.attr', 'type', 'password');
  
      // Click the eye icon to toggle password visibility
      cy.get('.eye-icon').click();
  
      // Check if the password field type is now text
      cy.get('input[id="password"]').should('have.attr', 'type', 'text');
  
      // Click the eye icon again to toggle password visibility back
      cy.get('.eye-icon').click();
  
      // Check if the password field type is now password
      cy.get('input[id="password"]').should('have.attr', 'type', 'password');
    });
  });