import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { DeleteUserService } from './delete-user.service';

describe('DeleteUserService', () => {
  let service: DeleteUserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeleteUserService]
    });
    service = TestBed.inject(DeleteUserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call deleteAccount and return a HttpResponse', () => {
    const token = 'test-token';
    const mockResponse = new HttpResponse({ status: 200 });

    service.deleteAccount(token).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/DeleteUser/${token}`);
    expect(req.request.method).toBe('DELETE');
    req.event(mockResponse);
  });

  it('should handle error when deleteAccount fails', () => {
    const token = 'test-token';
    const mockErrorResponse = { status: 400, statusText: 'Bad Request' };

    spyOn(console, 'error'); // Spy on console.error to suppress the error message

    service.deleteAccount(token).subscribe(
      () => fail('expected an error, not a response'),
      error => {
        expect(error.status).toBe(400);
      }
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/DeleteUser/${token}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, mockErrorResponse);

    expect(console.error).toHaveBeenCalled(); // Ensure console.error was called
  });
});
