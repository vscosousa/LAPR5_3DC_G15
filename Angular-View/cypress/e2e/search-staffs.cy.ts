describe('Search Staffs Page', () => {
    const uniqueId = Date.now();
    const uniqueEmail = `test.staff${uniqueId}@example.com`;
    const uniquePhoneNumber = `23456789${uniqueId}`;
  
    before(() => {
      cy.loginAsAdmin('admin@email.com', 'Adminadmin1@');
      cy.createStaff({
        firstName: `Test${uniqueId}`,
        lastName: `Staff${uniqueId}`,
        fullName: `Test Staff${uniqueId}`,
        email: uniqueEmail,
        identifier: '+351',
        phoneNumber: uniquePhoneNumber,
        staffType: 'Doctor',
        specializationName: 'Cardiology'
      });
    });
  
    beforeEach(() => {
      cy.loginAsAdmin('admin@email.com', 'Adminadmin1@');
      cy.visit('/search-staffs');
    });
  
    it('should display the search staff form', () => {
      // Verifica se o formulário de busca está visível
      cy.get('p').should('contain', 'Filter Fields');
      cy.get('form').should('be.visible');
      
      // Verifica se os campos do formulário estão visíveis
      cy.get('input[name="firstName"]').should('be.visible');
      cy.get('input[name="lastName"]').should('be.visible');
      cy.get('input[name="fullName"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('select[name="specialization"]').should('be.visible');
      
      // Verifica se os botões do formulário estão visíveis
      cy.get('button.btn-filter').should('be.visible');
      cy.get('button.btn-clear').should('be.visible');
      
      // Verifica se a tabela de resultados está visível
      cy.get('.table-container .table tbody').should('be.visible');
    });

    it('should allow the user to apply all filters', () => {
        // Preenche os campos do formulário
        cy.get('input[name="firstName"]').type(`Test${uniqueId}`);
        cy.get('input[name="lastName"]').type(`Staff${uniqueId}`);
        cy.get('input[name="fullName"]').type(`Test Staff${uniqueId}`);
        cy.get('input[name="email"]').type(uniqueEmail);
        cy.get('select[name="specialization"]').select('Cardiology');
    
        // Clica no botão de busca
        cy.get('button.btn-filter').click();
        cy.wait(2000);
    
        // Verifica se os resultados da busca são exibidos corretamente
        cy.get('.table-container .table tbody').should('contain', `Test Staff${uniqueId}`);
    });

    it('should allow the user to apply firstName filter', () => {
        // Preenche os campos do formulário
        cy.get('input[name="firstName"]').type(`Test${uniqueId}`);
    
        // Clica no botão de busca
        cy.get('button.btn-filter').click();
        cy.wait(2000);
    
        // Verifica se os resultados da busca são exibidos corretamente
        cy.get('.table-container .table tbody').should('contain', `Test Staff${uniqueId}`);
    });
    
    it('should allow the user to apply lastName filter', () => {
        // Preenche os campos do formulário
        cy.get('input[name="lastName"]').type(`Staff${uniqueId}`);
    
        // Clica no botão de busca
        cy.get('button.btn-filter').click();
        cy.wait(2000);
    
        // Verifica se os resultados da busca são exibidos corretamente
        cy.get('.table-container .table tbody').should('contain', `Test Staff${uniqueId}`);
    });

    it('should allow the user to apply fullName filter', () => {
        // Preenche os campos do formulário
        cy.get('input[name="fullName"]').type(`Test Staff${uniqueId}`);
    
        // Clica no botão de busca
        cy.get('button.btn-filter').click();
        cy.wait(2000);
    
        // Verifica se os resultados da busca são exibidos corretamente
        cy.get('.table-container .table tbody').should('contain', `Test Staff${uniqueId}`);
    });

    it('should allow the user to apply email filter', () => {
        // Preenche os campos do formulário
        cy.get('input[name="email"]').type(uniqueEmail);
    
        // Clica no botão de busca
        cy.get('button.btn-filter').click();
        cy.wait(2000);
    
        // Verifica se os resultados da busca são exibidos corretamente
        cy.get('.table-container .table tbody').should('contain', `Test Staff${uniqueId}`);
    });

    it('should allow the user to apply specialization filter', () => {
        // Preenche os campos do formulário
        cy.get('select[name="specialization"]').select('Cardiology');
    
        // Clica no botão de busca
        cy.get('button.btn-filter').click();
        cy.wait(2000);
    
        // Verifica se os resultados da busca são exibidos corretamente
        cy.get('.table-container .table tbody').should('contain', `Test Staff${uniqueId}`);
    });


  
    it('should clear the filters when the clear button is clicked', () => {
      // Preenche os campos do formulário
      cy.get('input[name="firstName"]').type(`Test${uniqueId}`);
      cy.get('input[name="lastName"]').type(`Staff${uniqueId}`);
      cy.get('input[name="fullName"]').type(`Test Staff${uniqueId}`);
      cy.get('input[name="email"]').type(uniqueEmail);
      cy.get('select[name="specialization"]').select('Cardiology');
  
      // Clica no botão de limpar
      cy.get('button.btn-clear').click();
  
      // Verifica se os campos do formulário foram limpos
      cy.get('input[name="firstName"]').should('have.value', '');
      cy.get('input[name="lastName"]').should('have.value', '');
      cy.get('input[name="fullName"]').should('have.value', '');
      cy.get('input[name="email"]').should('have.value', '');
      cy.get('select[name="specialization"]').should('have.value', '');
    });

    it('should display invalid email error', () => {
        // Preenche o campo de email com um email inválido
        cy.get('input[name="email"]').type('invalidEmail');
    
        // Clica no botão de busca
        cy.get('button.btn-filter').click();
    
        // Verifica se a mensagem de erro é exibida
        cy.get('.error-message').should('contain', 'Invalid email address');
      });

      it('should display error if all fields are empty', () => {
    
        // Clica no botão de busca
        cy.get('button.btn-filter').click();
    
        // Verifica se a mensagem de erro é exibida
        cy.get('.error-message').should('contain', 'At least one search parameter is required.');
      });
  });