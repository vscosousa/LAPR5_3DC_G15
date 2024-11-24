describe('Search Staff Page', () => {
    const uniqueId = Date.now();
    const uniqueEmail = `test.staff${uniqueId}@example.com`;
    const uniquePhoneNumber = `${uniqueId}`;
    const uniqueUser= `UserTest${uniqueId}`;
    
    before(() => {
      cy.log(`Created staff with email: ${uniqueEmail}`);
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
    
    it('should deactive a staff', () => {
      cy.get('input[name="email"]').type(uniqueEmail);
      cy.get('button.btn-filter').click();
      cy.get('.table-container .table tbody tr').first().find('.btn-activate').click();
  
      // Adicionar um tempo de espera explícito
      //cy.get('.manage-container app-active-modal').should('be.visible');
      // Preencher o formulário de ativação
      cy.get('form').should('be.visible');
      cy.get('input[id="username"]').type(uniqueUser);
  
      // Verificar se o botão de submit está visível e clicar nele
      cy.get('button.btn-submitUser').should('be.visible').click();
  
      // Verificar se o funcionário foi ativado
      cy.get('input[name="email"]').type(uniqueEmail);
      cy.get('button.btn-filter').click();
      cy.get('.table-container .table tbody').should('contain', `Test Staff${uniqueId}`);
      cy.get('.table-container .table tbody tr').first().find('.btn-deactive').click();
      cy.get('input[name="email"]').type(uniqueEmail);
      cy.get('button.btn-filter').click();
      cy.get('.table-container .table tbody').should('contain', `Test Staff${uniqueId}`);
      cy.get('.table-container .table tbody tr').first().should('contain', 'Activate');
    });
  
    it('should activate a staff', () => {
      cy.get('input[name="email"]').type(uniqueEmail);
      cy.get('button.btn-filter').click();
      cy.get('.table-container .table tbody tr').first().find('.btn-activate').click();
  
      // Adicionar um tempo de espera explícito
      //cy.get('.manage-container app-active-modal').should('be.visible');
      // Preencher o formulário de ativação
      cy.get('form').should('be.visible');
      cy.get('input[id="username"]').type(uniqueUser);
  
      // Verificar se o botão de submit está visível e clicar nele
      cy.get('button.btn-submitUser').should('be.visible').click();
  
      // Verificar se o funcionário foi ativado
      cy.get('input[name="email"]').type(uniqueEmail);
      cy.get('button.btn-filter').click();
      cy.get('.table-container .table tbody').should('contain', `Test Staff${uniqueId}`);
      cy.get('.table-container .table tbody tr').first().should('contain', 'Deactivate');
    });

});