describe('Update Staff Page', () => {
  const uniqueId = Date.now();
  const uniqueEmail = `test.staff${uniqueId}@example.com`;
  const uniquePhoneNumber = `23456789${uniqueId}`;
  
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
    cy.get('button.btn-filter').click();;
    cy.get('.table-container .table tbody').should('contain', `Test Staff${uniqueId}`);
  });
});