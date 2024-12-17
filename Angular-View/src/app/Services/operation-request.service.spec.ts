import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OperationRequestService } from './operation-request.service';

describe('OperationRequestService', () => {
  let service: OperationRequestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OperationRequestService]
    });
    service = TestBed.inject(OperationRequestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch operation requests', () => {
    const mockOperationRequests = [{ id: '1', deadlineDate: '2023-10-10', priority: 'High', medicalRecordNumber: '123', doctorLicenseNumber: '456', operationType: 'Type1' }];

    service.getOperationRequests().subscribe(operationRequests => {
      expect(operationRequests).toEqual(mockOperationRequests);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/operationRequest`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOperationRequests);
  });

  it('should fetch operation types', () => {
    const mockOperationTypes = [{ name: 'Type1', estimatedDuration: '1h', specializations: [] }];

    service.getOperationTypes().subscribe(operationTypes => {
      expect(operationTypes).toEqual(mockOperationTypes);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/OperationType`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOperationTypes);
  });

  it('should create an operation request', () => {
    const newOperationRequest = { deadlineDate: '2023-10-10', priority: 'High', medicalRecordNumber: '123', doctorLicenseNumber: '456', operationType: 'Type1' };

    service.createOperationRequest(newOperationRequest).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/OperationRequest`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newOperationRequest);
    req.flush({});
  });

  it('should handle error while creating an operation request', () => {
    const newOperationRequest = { deadlineDate: '2023-10-10', priority: 'High', medicalRecordNumber: '123', doctorLicenseNumber: '456', operationType: 'Type1' };

    service.createOperationRequest(newOperationRequest).subscribe(
      () => fail('should have failed with the error'),
      (error) => {
        expect(error.message).toBe('Error creating operation request');
      }
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/OperationRequest`);
    expect(req.request.method).toBe('POST');
    req.flush('Error creating operation request', { status: 500, statusText: 'Server Error' });
  });

  it('should edit an operation request', () => {
    const updatedOperationRequest = { deadlineDate: '2023-10-10', priority: 'High' };

    service.editOperationRequest('1', updatedOperationRequest).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/OperationRequest/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedOperationRequest);
    req.flush({});
  });

  it('should handle error while editing an operation request', () => {
    const updatedOperationRequest = { deadlineDate: '2023-10-10', priority: 'High' };

    service.editOperationRequest('1', updatedOperationRequest).subscribe(
      () => fail('should have failed with the error'),
      (error) => {
        expect(error.message).toBe('Error editing operation request');
      }
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/OperationRequest/1`);
    expect(req.request.method).toBe('PUT');
    req.flush('Error editing operation request', { status: 500, statusText: 'Server Error' });
  });

  it('should delete an operation request', () => {
    service.deleteOperationRequest('1', '456').subscribe(response => {
      expect(response.status).toBe(200);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/OperationRequest/1?doctorLicenseNumber=456`);
    expect(req.request.method).toBe('DELETE');
    req.flush({}, { status: 200, statusText: 'OK' });
  });

  it('should handle error while deleting an operation request', () => {
    service.deleteOperationRequest('1', '456').subscribe(
      () => fail('should have failed with the error'),
      (error) => {
        expect(error.message).toBe('Error deleting operation request');
      }
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/OperationRequest/1?doctorLicenseNumber=456`);
    expect(req.request.method).toBe('DELETE');
    req.flush('Error deleting operation request', { status: 500, statusText: 'Server Error' });
  });

  it('should fetch operation requests with advanced filter', () => {
    const mockOperationRequests = [{ id: '1', deadlineDate: '2023-10-10', priority: 'High', medicalRecordNumber: '123', doctorLicenseNumber: '456', operationType: 'Type1' }];

    service.getOperationRequestsWithAdvancedFilter('1', '456', 'Type1', '2023-10-10', '123', 'High').subscribe(operationRequests => {
      expect(operationRequests).toEqual(mockOperationRequests);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/OperationRequest?operationRequest=1&doctorLicenseNumber=456&operationType=Type1&deadlineDate=2023-10-10&patientMedicalRecordNumber=123&priority=High`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOperationRequests);
  });
});
