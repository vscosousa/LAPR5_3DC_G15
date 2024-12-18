describe('Create Appointment Workflow', () => {
  const uniqueId = Date.now();
  const uniqueDateTime = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().slice(0, 16);
  const formattedDateTime = new Date(uniqueDateTime).toLocaleString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(',', ' -');

  beforeEach(() => {
    cy.loginAsDoctor('carlamatos@gmail.com', 'Doctor1234+');
  });

  it('should create an appointment successfully', () => {
    let successAlertTriggered = false;

    // Listen for success alert and set flag
    cy.on('window:alert', (str) => {
      if (str === 'Operation requested successfully') {
        successAlertTriggered = true;
      }
    });

    // Navigate to operation requests
    cy.get('button.box4').click();
    cy.wait(3000);
    cy.url().should('include', '/operation-requests');

    // Create an operation request
    cy.get('button.btn-create').click();
    cy.wait(3000);
    cy.url().should('include', '/create-operation-request');
    cy.get('input#deadlineDate').type('2025-01-01');
    cy.get('select#priority').select('ElectiveSurgery');
    cy.get('select#patientMedicalRecordNumber').select('202412000076 - Teste Casa');
    cy.get('select#operationType').select('MyTest');
    cy.get('button[type="submit"]').click();

    // Handle success alert
    cy.wait(3000).then(() => {
      if (!successAlertTriggered) {
        throw new Error('Expected success alert was not triggered');
      }
    });

    cy.url().should('include', '/operation-requests');

    // Create an appointment
    cy.get('a.btn-view').first().click();
    cy.wait(3000);
    cy.url().should('include', '/create-appointment');
    cy.get('select[name="roomId"]').select('Room 1');
    cy.get('input[name="dateTime"]').type(uniqueDateTime);
    cy.get('.checkbox-box').first().find('input[type="checkbox"]').first().check();
    cy.get('button.btn-create').click();
    cy.wait(3000);

    // Verify appointment creation
    cy.url().should('include', '/appointment-manager');
    cy.wait(3000);
    cy.get('.table-container .table tbody').should('contain', formattedDateTime);
  });

  it('should fail to create an appointment with missing fields', () => {
    let successAlertTriggered = false;
    let errorAlertTriggered = false;

    // Listen for alerts and set flags
    cy.on('window:alert', (str) => {
      if (str === 'Operation requested successfully') {
        successAlertTriggered = true;
      } else if (str === 'Error creating appointment') {
        errorAlertTriggered = true;
      }
    });

    // Navigate to operation requests
    cy.get('button.box4').click();
    cy.wait(3000);
    cy.url().should('include', '/operation-requests');

    // Create an operation request
    cy.get('button.btn-create').click();
    cy.wait(3000);
    cy.url().should('include', '/create-operation-request');
    cy.get('input#deadlineDate').type('2025-01-02');
    cy.get('select#priority').select('ElectiveSurgery');
    cy.get('select#patientMedicalRecordNumber').select('202412000076 - Teste Casa');
    cy.get('select#operationType').select('MyTest');
    cy.get('button[type="submit"]').click();

    // Handle success alert
    cy.wait(3000).then(() => {
      if (!successAlertTriggered) {
        throw new Error('Expected success alert was not triggered');
      }
    });

    // Check for any error messages
    cy.get('.error-message').should('not.exist');

    // Increase wait time to ensure page load
    cy.wait(3000);
    cy.url().should('include', '/operation-requests');

    // Attempt to create an appointment with missing fields
    cy.get('a.btn-view').first().click();
    cy.wait(3000);
    cy.url().should('include', '/create-appointment');
    cy.get('button.btn-create').click();
    cy.wait(3000);

    // Handle error alert
    cy.wait(3000).then(() => {
      if (!errorAlertTriggered) {
        throw new Error('Expected error alert was not triggered');
      }
    });
  });
});
