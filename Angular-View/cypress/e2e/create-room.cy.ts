describe('Update Room Page', () => {
  const uniqueRoomName = `Room-${Math.floor(Math.random() * 100)}`;
  const uniqueRoomType = `Type-${Math.floor(Math.random() * 100)}`;
  const uniqueRoomDescription = `Description-${Math.floor(Math.random() * 100)}`;

  before(() => {
    cy.loginAsAdmin('admin@email.com', 'Adminadmin1@');
    cy.createRoom({
      name: uniqueRoomName,
      type: uniqueRoomType,
      description: uniqueRoomDescription
    });
  });

  beforeEach(() => {
    cy.loginAsAdmin('admin@email.com', 'Adminadmin1@');
    cy.visit('/manage-operation-rooms');
  });

  it('should display the update room form', () => {
    cy.contains('tr', uniqueRoomName).within(() => {
      cy.get('button.btn-view').contains('Update').click();
    });
    cy.get('h2').should('contain', 'Update Room');
    cy.get('form').should('be.visible');
  });

  it('should allow the user to update room details', () => {
    cy.contains('tr', uniqueRoomName).within(() => {
      cy.get('button.btn-view').contains('Update').click();
    });
    cy.get('input[name="room-name"]').should('have.value', uniqueRoomName);
    cy.get('input[name="room-name"]').clear().type(`Updated Room Name`);
    cy.get('input[name="room-type"]').clear().type(`Updated Room Type`);
    cy.get('input[name="room-description"]').clear().type(`Updated Room Description`);

    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/manage-operation-rooms');
    cy.get('.table-container .table tbody').should('contain', `Updated Room Name`);
  });

  it('should display an alert with the message: Failed to update room', () => {
    cy.contains('tr', uniqueRoomName).within(() => {
      cy.get('button.btn-view').contains('Update').click();
    });
    cy.get('input[name="room-name"]').clear();
    cy.get('input[name="room-description"]').clear();

    cy.get('button[type="submit"]').click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('Failed to update room.');
    });
  });
});