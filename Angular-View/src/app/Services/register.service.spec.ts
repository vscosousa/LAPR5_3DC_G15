import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RegisterService } from './register.service';
import { HttpResponse } from '@angular/common/http';

// Test suite for RegisterService
// Author: Vasco Sousa (1221700)
// Last Updated: 07/11/2024

describe('RegisterService', () => {
  let service: RegisterService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Set up the testing module for RegisterService
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(RegisterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Test to check if the service is created successfully
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call register and return a HttpResponse', () => {
    const email = 'test@example.com';
    const identifier = '+1';
    const phoneNumber = '1234567890';
    const password = 'password';
    const mockResponse = new HttpResponse({ status: 200, body: 'auth-token' });

    service.register(email, identifier, phoneNumber, password).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('authToken')).toBe('auth-token');
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/RegisterUserAsPatient`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email,
      phoneNumber: identifier + phoneNumber,
      password
    });
    req.event(mockResponse);
  });

  it('should handle error when register fails', () => {
    const email = 'test@example.com';
    const identifier = '+1';
    const phoneNumber = '1234567890';
    const password = 'password';
    const mockErrorResponse = { status: 400, statusText: 'Bad Request' };

    spyOn(console, 'log'); // Spy on console.log to suppress the log message

    service.register(email, identifier, phoneNumber, password).subscribe(
      () => fail('expected an error, not a response'),
      error => {
        expect(error.status).toBe(400);
      }
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/RegisterUserAsPatient`);
    expect(req.request.method).toBe('POST');
    req.flush(null, mockErrorResponse);

    expect(console.log).toHaveBeenCalled(); // Ensure console.log was called
  });
});
