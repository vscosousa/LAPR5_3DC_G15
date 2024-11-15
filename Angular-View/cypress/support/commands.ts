// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
declare namespace Cypress {
  interface Chainable<Subject = any> {
    createPatient(patient: {
      firstName: string;
      lastName: string;
      fullName: string;
      dateOfBirth: string;
      genderOptions: string;
      email: string;
      phoneNumber: string;
      emergencyContact: string;
      medicalConditions: string;
    }): Chainable<any>;
    loginAsAdmin(email: string, password: string): Chainable<any>;
    loginAsPatient(email: string, password: string): Chainable<any>;
    activatePatientAccount(token: string): Chainable<any>;
  }
}
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('createPatient', (patient) => {
  cy.visit('/panel-admin');
  cy.get('button[routerLink="/manage-patients"]').click();
  cy.get('button[routerLink="/create-patient"]').click();
  cy.get('input[name="firstName"]').type(patient.firstName);
  cy.get('input[name="lastName"]').type(patient.lastName);
  cy.get('input[name="fullName"]').type(patient.fullName);
  cy.get('input[name="dateOfBirth"]').type(patient.dateOfBirth);
  cy.get('select[name="genderOptions"]').select(patient.genderOptions);
  cy.get('input[name="email"]').type(patient.email);
  cy.get('input[name="phoneNumber"]').type(patient.phoneNumber);
  cy.get('input[name="emergencyContact"]').type(patient.emergencyContact);
  cy.get('textarea[name="medicalConditions"]').type(patient.medicalConditions);
  cy.get('form').submit();
});

Cypress.Commands.add('loginAsAdmin', (email, password) => {
  cy.visit('/login');
  cy.get('input[id="email"]').type(email);
  cy.get('input[id="password"]').type(password);
  cy.get('form').submit();
  cy.url().should('include', '/panel-admin');
});

Cypress.Commands.add('activatePatientAccount', (token) => {
  cy.visit(`/activate-patient-user?token=${token}`);
  cy.get('.activate-button').click();
});


Cypress.Commands.add('loginAsPatient', (email, password) => {
  cy.visit('/login');
  cy.get('input[id="email"]').type(email);
  cy.get('input[id="password"]').type(password);
  cy.get('form').submit();
  cy.url().should('include', '/patient-panel');
});
