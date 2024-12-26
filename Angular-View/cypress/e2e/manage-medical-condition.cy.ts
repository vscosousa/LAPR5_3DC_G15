describe('Manage Medical Conditions', () => {
    const uniqueId = Date.now();
    const uniqueConditionName = `Test Condition ${uniqueId}`;
    const uniqueConditionCode = `A${uniqueId.toString().slice(-3)}`; // Código ICD único e válido
    const uniqueConditionDescription = `This is a test condition description ${uniqueId}.`;
    const uniqueConditionSymptoms = `Symptoms ${uniqueId}`;
    const updatedConditionName = `Updated Condition ${uniqueId}`;
    const updatedConditionDescription = `This is an updated test condition description ${uniqueId}.`;
    const updatedConditionSymptoms = `Updated Symptoms ${uniqueId}`;

    beforeEach(() => {
        cy.loginAsAdmin('admin@email.com', 'Adminadmin1@');
        cy.visit('/manage-allergies-and-conditions');
    });
    
    it('should display the list of medical conditions', () => {
        cy.contains('Medical Conditions').should('be.visible');
        cy.get('div.screen').contains('Medical Conditions').parent().within(() => {
            cy.get('table').within(() => {
                cy.contains('th', 'Conditions').should('be.visible');
                cy.contains('th', 'Actions').should('be.visible');
            });
        });
    });

    it('should create a new medical condition', () => {
        cy.get('div.screen').contains('Medical Conditions').parent().within(() => {
            cy.get('button.btn-create').contains('Create').click();
        });
        cy.url().should('include', '/manage-allergies-and-conditions/create-conditions');
        cy.get('h2').contains('Create Medical Condition').should('be.visible');
        cy.get('form').should('be.visible');
            
        cy.get('input[name="condition-code"]').type(uniqueConditionCode);
        cy.get('input[name="condition-name"]').type(uniqueConditionName);
        cy.get('input[name="condition-description"]').type(uniqueConditionDescription);
        cy.get('input[name="condition-symptoms"]').type(uniqueConditionSymptoms);
        cy.get('button[type="submit"]').click();
        cy.contains('Medical Conditions').should('be.visible');
        cy.contains(uniqueConditionName).should('be.visible');
    });

    it('should view details of a medical condition', () => {
        cy.contains('Medical Conditions').should('be.visible');
        cy.get('div.screen').contains('Medical Conditions').parent().within(() => {
            cy.contains(uniqueConditionName).parent().within(() => {
                cy.get('button.btn-view').contains('View Details').click();
            });
        });
        cy.get('h2').contains(`${uniqueConditionName} Details`).should('be.visible');
        cy.contains(`Code: ${uniqueConditionCode}`).should('be.visible');
        cy.contains(`Description: ${uniqueConditionDescription}`).should('be.visible');
        cy.contains(`Symptoms: ${uniqueConditionSymptoms}`).should('be.visible');
    });

    it('should update a medical condition', () => {
        cy.contains('Medical Conditions').should('be.visible');
        cy.get('div.screen').contains('Medical Conditions').parent().within(() => {
            cy.contains(uniqueConditionName).parent().within(() => {
                cy.get('button.btn-view').contains('Update').click();
            });
        });
        cy.url().should('include', '/manage-allergies-and-conditions/update-conditions');
        cy.get('h2').contains('Update Condition').should('be.visible');
        cy.get('form').should('be.visible');
            
        cy.get('input[name="medicalCondition-name"]').clear().type(updatedConditionName);
        cy.get('input[name="medicalCondition-description"]').clear().type(updatedConditionDescription);
        cy.get('input[name="medicalCondition-symptoms"]').clear().type(updatedConditionSymptoms);
        cy.get('button[type="submit"]').click();
        cy.contains('Medical Conditions').should('be.visible');
        cy.contains(updatedConditionName).should('be.visible');
    });
});