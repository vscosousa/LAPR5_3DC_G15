describe('Create Staff Page', () => {
    const uniqueId = Date.now();
    const uniqueEmail = `test.staff${uniqueId}@example.com`;
    const uniquePhoneNumber = `23456789${uniqueId}`;

    beforeEach(() => {
        cy.loginAsAdmin('admin@email.com', 'Adminadmin1@');
        cy.visit('/create-staff');
    });

    it('should display the create staff form', () => {
        cy.get('h2').should('contain', 'Create Staff');
        cy.get('form').should('be.visible');
    });

    it('should allow the user to fill out the form and create a new staff', () => {
        cy.get('input[id="firstName"]').type(`Test${uniqueId}`);
        cy.get('input[id="lastName"]').type(`Staff${uniqueId}`);
        cy.get('input[id="fullName"]').type(`Test Staff${uniqueId}`);
        cy.get('input[id="email"]').type(uniqueEmail);
        cy.get('input[id="identifier"]').type('+351');
        cy.get('input[id="phoneNumber"]').type(uniquePhoneNumber);
        cy.get('select[id="staffType"]').select('Doctor');
        cy.get('select[id="specializationName"]').select('Cardiology');

        cy.get('button[type="submit"]').click();

        cy.url().should('include', '/search-staffs');
        cy.get('.table-container .table tbody').should('contain', `Test Staff${uniqueId}`);
    });
});