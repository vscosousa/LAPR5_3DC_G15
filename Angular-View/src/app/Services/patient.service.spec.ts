import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PatientService } from './patient.service';
import { HttpResponse } from '@angular/common/http';

// Test suite for PatientService
// Author: Vasco Sousa (1221700)
// Last Updated: 12/11/2024

describe('PatientService', () => {
  let service: PatientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Set up the testing module for PatientService
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PatientService]
    });
    service = TestBed.inject(PatientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Test to check if the service is created successfully
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call deletePatient and return a HttpResponse', () => {
    const patientId = 'test-id';
    const mockResponse = new HttpResponse({ status: 200 });

    service.deletePatient(patientId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/Patient/${patientId}`);
    expect(req.request.method).toBe('DELETE');
    req.event(mockResponse);
  });

  it('should handle error when deletePatient fails', () => {
    const patientId = 'test-id';
    const mockErrorResponse = { status: 400, statusText: 'Bad Request' };

    spyOn(console, 'error'); // Spy on console.error to suppress the error message

    service.deletePatient(patientId).subscribe(
      () => fail('expected an error, not a response'),
      error => {
        expect(error.status).toBe(400);
      }
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/Patient/${patientId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, mockErrorResponse);

    expect(console.error).toHaveBeenCalled(); // Ensure console.error was called
  });

  it('should call getPatientsWithAdvancedFilter and return an array of patients', () => {
    const mockPatients = [{ firstName: 'Test', lastName: 'Patient' }];
    const queryParams = 'firstName=&lastName=&fullName=&dateOfBirth=&medicalRecordNumber=&gender=&email=&phoneNumber=';

    service.getPatientsWithAdvancedFilter().subscribe(patients => {
      expect(patients).toEqual(mockPatients);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/Patient?${queryParams}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPatients);
  });

  it('should call createPatient and return the created patient', () => {
    const newPatient = { firstName: 'Test', lastName: 'Patient', fullName: 'Test Patient', dateOfBirth: '1990-01-01', genderOptions: '1', email: 'test@example.com', phoneNumber: '+1234567890', emergencyContact: '+234567', medicalConditions: 'None' };
    const mockResponse = { id: '1', ...newPatient };

    service.createPatient(newPatient).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/Patient`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should call updatePatient and return the updated patient', () => {
    const medicalRecordNumber = '202411000001';
    const updatedPatient = { firstName: 'Updated', lastName: 'Patient', fullName: 'Updated Patient', email: 'updated@example.com', phoneNumber: '+1234567890', emergencyContact: '+765432', medicalConditions: 'None' };
    const mockResponse = { id: '1', ...updatedPatient };

    service.updatePatient(medicalRecordNumber, updatedPatient).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/Patient/${medicalRecordNumber}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });
});
