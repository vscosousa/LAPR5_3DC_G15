describe('Update Staff Page', () => {
  const uniqueId = Date.now();
  const uniqueEmail = `test.staff${uniqueId}@example.com`;
  const uniquePhoneNumber = `${uniqueId}`;
  
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

  it('should display the update staff form', () => {
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('button.btn-filter').click();
    cy.get('.table-container .table tbody tr').first().find('.btn-update').click();
    cy.get('h2').should('contain', 'Edit Staff');
    cy.get('form').should('be.visible');
  });

  it('should auto-fill the form with staff details', () => {
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('button.btn-filter').click();
    cy.get('.table-container .table tbody tr').first().find('.btn-update').click();

    // Verificar se os campos estão preenchidos automaticamente
    cy.get('input[id="identifier"]').should('have.value', '+351');
    cy.get('input[id="phoneNumber"]').should('have.value', uniquePhoneNumber);
    cy.get('input[id="email"]').should('have.value', uniqueEmail);
    cy.get('select[id="specializationName"]').should('have.value', 'Cardiology');
  });

  it('should allow the user to update staff details', () => {
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('button.btn-filter').click();
    cy.get('.table-container .table tbody tr').first().find('.btn-update').click();
    cy.get('input[id="identifier"]').clear().type(`+351`);
    cy.get('input[id="phoneNumber"]').clear().type(`456789${uniqueId}`);
    cy.get('input[id="email"]').clear().type(`updated.${uniqueEmail}`);
    cy.get('select[id="specializationName"]').select('Neurology');

    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/search-staffs');
    cy.get('select[name="specialization"]').select('Neurology');
    cy.get('button.btn-filter').click();
    cy.get('.table-container .table tbody').should('contain', `Test Staff${uniqueId}`);
  });

  it('should show an error if a required field is missing', () => {
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('button.btn-filter').click();
    cy.get('.table-container .table tbody tr').first().find('.btn-update').click();

    cy.get('input[id="identifier"]').clear();
    cy.get('input[id="phoneNumber"]').clear();
    cy.get('input[id="email"]').clear();
    cy.get('select[id="specializationName"]').select('');

    cy.get('button[type="submit"]').click();

    cy.get('input[id="identifier"]:invalid').should('exist');
    cy.get('input[id="phoneNumber"]:invalid').should('exist');
    cy.get('input[id="email"]:invalid').clear().should('exist');
    cy.get('select[id="specializationName"]:invalid').should('exist');
  });

  it('should show an error if identifier is missing', () => {
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('button.btn-filter').click();
    cy.get('.table-container .table tbody tr').first().find('.btn-update').click();

    cy.get('input[id="identifier"]').clear();
    cy.get('button[type="submit"]').click();

    cy.get('input[id="identifier"]:invalid').should('exist');
  });

  it('should show an error if phoneNumber is missing', () => {
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('button.btn-filter').click();
    cy.get('.table-container .table tbody tr').first().find('.btn-update').click();

    cy.get('input[id="phoneNumber"]').clear();
    cy.get('button[type="submit"]').click();

    cy.get('input[id="phoneNumber"]:invalid').should('exist');
  });

  it('should show an error if email is missing', () => {
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('button.btn-filter').click();
    cy.get('.table-container .table tbody tr').first().find('.btn-update').click();

    cy.get('input[id="email"]').clear();
    cy.get('button[type="submit"]').click();

    cy.get('input[id="email"]:invalid').should('exist');
  });

  it('should show an error if specializationName is missing', () => {
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('button.btn-filter').click();
    cy.get('.table-container .table tbody tr').first().find('.btn-update').click();

    cy.get('select[id="specializationName"]').select('');
    cy.get('button[type="submit"]').click();

    cy.get('select[id="specializationName"]:invalid').should('exist');
  });

}); 