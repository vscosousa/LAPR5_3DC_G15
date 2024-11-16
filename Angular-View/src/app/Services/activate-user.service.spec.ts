import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ActivateUserService } from './activate-user.service';

describe('ActivateUserService', () => {
  let service: ActivateUserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ActivateUserService]
    });
    service = TestBed.inject(ActivateUserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call activateAccount and return a HttpResponse', () => {
    const token = 'test-token';
    const mockResponse = new HttpResponse({ status: 200 });

    service.activateAccount(token).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/ActivatePatientUser?token=${token}`);
    expect(req.request.method).toBe('POST');
    req.event(mockResponse);
  });

  it('should handle error when activateAccount fails', () => {
    const token = 'test-token';
    const mockErrorResponse = { status: 400, statusText: 'Bad Request' };

    spyOn(console, 'error');

    service.activateAccount(token).subscribe(
      () => fail('expected an error, not a response'),
      error => {
        expect(error.status).toBe(400);
      }
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/ActivatePatientUser?token=${token}`);
    expect(req.request.method).toBe('POST');
    req.flush(null, mockErrorResponse);

    expect(console.error).toHaveBeenCalled();
  });
});
