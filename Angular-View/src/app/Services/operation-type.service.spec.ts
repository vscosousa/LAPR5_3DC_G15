import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OperationTypeService } from './operation-type.service';

describe('OperationTypeService', () => {
  let service: OperationTypeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OperationTypeService]
    });
    service = TestBed.inject(OperationTypeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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

  it('should fetch specializations', () => {
    const mockSpecializations = [{ name: 'Specialization1' }];

    service.getSpecializations().subscribe(specializations => {
      expect(specializations).toEqual(mockSpecializations);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/Specialization`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSpecializations);
  });

  it('should create an operation type', () => {
    const newOperationType = { name: 'Type1', estimatedDuration: '1h', specializations: [] };

    service.createOperationType(newOperationType).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/OperationType`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newOperationType);
    req.flush({});
  });

  it('should fetch staff members for a specific specialization', () => {
    const mockStaffs = [{ name: 'Staff1' }];

    service.getStaffs('Specialization1').subscribe(staffs => {
      expect(staffs).toEqual(mockStaffs);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/Specialization/staff/Specialization1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStaffs);
  });

  it('should handle error while fetching staff members', () => {
    service.getStaffs('Specialization1').subscribe(
      () => fail('should have failed with the error'),
      (error) => {
        expect(error.message).toBe('Failed to fetch staff members');
      }
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/Specialization/staff/Specialization1`);
    expect(req.request.method).toBe('GET');
    req.flush('Error fetching staff', { status: 500, statusText: 'Server Error' });
  });

  it('should edit an operation type', () => {
    const updatedOperationType = { name: 'Type1', estimatedDuration: '1h', specializations: [] };

    service.editOperationType('Type1', updatedOperationType).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/OperationType/Type1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedOperationType);
    req.flush({});
  });

  it('should fetch an operation type by name', () => {
    const mockOperationType = { name: 'Type1', estimatedDuration: '1h', specializations: [] };

    service.getOperationTypeByName('Type1').subscribe(operationType => {
      expect(operationType).toEqual(mockOperationType);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/OperationType/name/Type1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOperationType);
  });

  it('should deactivate an operation type by name', () => {
    service.deactivateOperationTypeByName('Type1').subscribe(response => {
      expect(response).toEqual('Deactivated');
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/OperationType/deactivate/Type1`);
    expect(req.request.method).toBe('PUT');
    req.flush('Deactivated');
  });

  it('should handle error while deactivating an operation type', () => {
    service.deactivateOperationTypeByName('Type1').subscribe(
      () => fail('should have failed with the error'),
      (error) => {
        expect(error.message).toBe('Deactivation failed');
      }
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/OperationType/deactivate/Type1`);
    expect(req.request.method).toBe('PUT');
    req.flush('Deactivation failed', { status: 500, statusText: 'Server Error' });
  });

  it('should activate an operation type by name', () => {
    service.activateOperationTypeByName('Type1').subscribe(response => {
      expect(response).toEqual('Activated');
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/OperationType/activate/Type1`);
    expect(req.request.method).toBe('PUT');
    req.flush('Activated');
  });

  it('should handle error while activating an operation type', () => {
    service.activateOperationTypeByName('Type1').subscribe(
      () => fail('should have failed with the error'),
      (error) => {
        expect(error.message).toBe('Activation failed');
      }
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/OperationType/activate/Type1`);
    expect(req.request.method).toBe('PUT');
    req.flush('Activation failed', { status: 500, statusText: 'Server Error' });
  });
});
