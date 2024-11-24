describe('Create Staff Page', () => {
    const uniqueId = Date.now();
    const uniqueEmail = `test.staff${uniqueId}@example.com`;
    const uniquePhoneNumber = `${uniqueId}`;

    beforeEach(() => {
        cy.loginAsAdmin('admin@email.com', 'Adminadmin1@');
        cy.visit('/create-staff');
    });

    it('should display the create staff form', () => {
        cy.get('h2').should('contain', 'Create Staff');
        cy.get('form').should('be.visible');
        cy.get('input[id="firstName"]').should('be.visible');
        cy.get('input[id="lastName"]').should('be.visible');
        cy.get('input[id="fullName"]').should('be.visible');
        cy.get('input[id="email"]').should('be.visible');
        cy.get('input[id="identifier"]').should('be.visible');
        cy.get('input[id="phoneNumber"]').should('be.visible');
        cy.get('select[id="staffType"]').should('be.visible');
        cy.get('select[id="specializationName"]').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible');
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

        // Verificar se os campos obrigatórios estão preenchidos
        cy.get('input[id="firstName"]').should('have.value', `Test${uniqueId}`);
        cy.get('input[id="lastName"]').should('have.value', `Staff${uniqueId}`);
        cy.get('input[id="fullName"]').should('have.value', `Test Staff${uniqueId}`);
        cy.get('input[id="email"]').should('have.value', uniqueEmail);
        cy.get('input[id="identifier"]').should('have.value', '+351');
        cy.get('input[id="phoneNumber"]').should('have.value', uniquePhoneNumber);
        cy.get('select[id="staffType"]').should('have.value', 'Doctor');
        cy.get('select[id="specializationName"]').should('have.value', 'Cardiology');

        cy.get('button[type="submit"]').click();

        cy.url().should('include', '/search-staffs');
        cy.get('.table-container .table tbody').should('contain', `Test Staff${uniqueId}`);
    });

    it('should show an error if a required field is missing', () => {
        // Tentar submeter o formulário sem preencher os campos obrigatórios
        cy.get('button[type="submit"]').click();
    
        // Verificar se as mensagens de erro são exibidas
        cy.get('input[id="firstName"]:invalid').should('exist');
        cy.get('input[id="lastName"]:invalid').should('exist');
        cy.get('input[id="fullName"]:invalid').should('exist');
        cy.get('input[id="email"]:invalid').should('exist');
        cy.get('input[id="identifier"]:invalid').should('exist');
        cy.get('input[id="phoneNumber"]:invalid').should('exist');
        cy.get('select[id="staffType"]:invalid').should('exist');
        cy.get('select[id="specializationName"]:invalid').should('exist');
    });

    it('should show an error if firstName is missing', () => {
        cy.get('input[id="lastName"]').type(`Staff${uniqueId}`);
        cy.get('input[id="fullName"]').type(`Test Staff${uniqueId}`);
        cy.get('input[id="email"]').type(uniqueEmail);
        cy.get('input[id="identifier"]').type('+351');
        cy.get('input[id="phoneNumber"]').type(uniquePhoneNumber);
        cy.get('select[id="staffType"]').select('Doctor');
        cy.get('select[id="specializationName"]').select('Cardiology');
        cy.get('button[type="submit"]').click();
        cy.get('input[id="firstName"]:invalid').should('exist');
    });

    it('should show an error if lastName is missing', () => {
        cy.get('input[id="firstName"]').type(`Test${uniqueId}`);
        cy.get('input[id="fullName"]').type(`Test Staff${uniqueId}`);
        cy.get('input[id="email"]').type(uniqueEmail);
        cy.get('input[id="identifier"]').type('+351');
        cy.get('input[id="phoneNumber"]').type(uniquePhoneNumber);
        cy.get('select[id="staffType"]').select('Doctor');
        cy.get('select[id="specializationName"]').select('Cardiology');
        cy.get('button[type="submit"]').click();
        cy.get('input[id="lastName"]:invalid').should('exist');
    });

    it('should show an error if fullName is missing', () => {
        cy.get('input[id="firstName"]').type(`Test${uniqueId}`);
        cy.get('input[id="lastName"]').type(`Staff${uniqueId}`);
        cy.get('input[id="email"]').type(uniqueEmail);
        cy.get('input[id="identifier"]').type('+351');
        cy.get('input[id="phoneNumber"]').type(uniquePhoneNumber);
        cy.get('select[id="staffType"]').select('Doctor');
        cy.get('select[id="specializationName"]').select('Cardiology');
        cy.get('button[type="submit"]').click();
        cy.get('input[id="fullName"]:invalid').should('exist');
    });

    it('should show an error if email is missing', () => {
        cy.get('input[id="firstName"]').type(`Test${uniqueId}`);
        cy.get('input[id="lastName"]').type(`Staff${uniqueId}`);
        cy.get('input[id="fullName"]').type(`Test Staff${uniqueId}`);
        cy.get('input[id="identifier"]').type('+351');
        cy.get('input[id="phoneNumber"]').type(uniquePhoneNumber);
        cy.get('select[id="staffType"]').select('Doctor');
        cy.get('select[id="specializationName"]').select('Cardiology');
        cy.get('button[type="submit"]').click();
        cy.get('input[id="email"]:invalid').should('exist');
    });

    it('should show an error if email is invalid', () => {
        cy.get('input[id="firstName"]').type(`Test${uniqueId}`);
        cy.get('input[id="lastName"]').type(`Staff${uniqueId}`);
        cy.get('input[id="fullName"]').type(`Test Staff${uniqueId}`);
        cy.get('input[id="email"]').type('invalid-email');
        cy.get('input[id="identifier"]').type('+351');
        cy.get('input[id="phoneNumber"]').type(uniquePhoneNumber);
        cy.get('select[id="staffType"]').select('Doctor');
        cy.get('select[id="specializationName"]').select('Cardiology');
        cy.get('button[type="submit"]').click();
        cy.get('input[id="email"]:invalid').should('exist');
    });

    it('should show an error if identifier is missing', () => {
        cy.get('input[id="firstName"]').type(`Test${uniqueId}`);
        cy.get('input[id="lastName"]').type(`Staff${uniqueId}`);
        cy.get('input[id="fullName"]').type(`Test Staff${uniqueId}`);
        cy.get('input[id="email"]').type(uniqueEmail);
        cy.get('input[id="phoneNumber"]').type(uniquePhoneNumber);
        cy.get('select[id="staffType"]').select('Doctor');
        cy.get('select[id="specializationName"]').select('Cardiology');
        cy.get('button[type="submit"]').click();
        cy.get('input[id="identifier"]:invalid').should('exist');
    });

    it('should show an error if phoneNumber is missing', () => {
        cy.get('input[id="firstName"]').type(`Test${uniqueId}`);
        cy.get('input[id="lastName"]').type(`Staff${uniqueId}`);
        cy.get('input[id="fullName"]').type(`Test Staff${uniqueId}`);
        cy.get('input[id="email"]').type(uniqueEmail);
        cy.get('input[id="identifier"]').type('+351');
        cy.get('select[id="staffType"]').select('Doctor');
        cy.get('select[id="specializationName"]').select('Cardiology');
        cy.get('button[type="submit"]').click();
        cy.get('input[id="phoneNumber"]:invalid').should('exist');
    });

    it('should show an error if staffType is missing', () => {
        cy.get('input[id="firstName"]').type(`Test${uniqueId}`);
        cy.get('input[id="lastName"]').type(`Staff${uniqueId}`);
        cy.get('input[id="fullName"]').type(`Test Staff${uniqueId}`);
        cy.get('input[id="email"]').type(uniqueEmail);
        cy.get('input[id="identifier"]').type('+351');
        cy.get('input[id="phoneNumber"]').type(uniquePhoneNumber);
        cy.get('select[id="specializationName"]').select('Cardiology');
        cy.get('button[type="submit"]').click();
        cy.get('select[id="staffType"]:invalid').should('exist');
    });

    it('should show an error if specializationName is missing', () => {
        cy.get('input[id="firstName"]').type(`Test${uniqueId}`);
        cy.get('input[id="lastName"]').type(`Staff${uniqueId}`);
        cy.get('input[id="fullName"]').type(`Test Staff${uniqueId}`);
        cy.get('input[id="email"]').type(uniqueEmail);
        cy.get('input[id="identifier"]').type('+351');
        cy.get('input[id="phoneNumber"]').type(uniquePhoneNumber);
        cy.get('select[id="staffType"]').select('Doctor');
        cy.get('button[type="submit"]').click();
        cy.get('select[id="specializationName"]:invalid').should('exist');
    });
});