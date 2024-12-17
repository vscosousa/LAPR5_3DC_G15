import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MedicalConditionService } from './medical-condition.service';

describe('MedicalConditionService', () => {
  let service: MedicalConditionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MedicalConditionService]
    });
    service = TestBed.inject(MedicalConditionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch medical conditions', () => {
    const mockMedicalConditions = [
      { medicalConditionCode: 'MC1', medicalConditionName: 'Condition1', medicalConditionDescription: 'Description1', medicalConditionSymptoms: 'Symptoms1' }
    ];

    service.getMedicalConditions().subscribe(medicalConditions => {
      expect(medicalConditions).toEqual(mockMedicalConditions);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMedicalConditions);
  });

  it('should create a medical condition', () => {
    const newMedicalCondition = {
      medicalConditionCode: 'MC1',
      medicalConditionName: 'Condition1',
      medicalConditionDescription: 'Description1',
      medicalConditionSymptoms: 'Symptoms1'
    };

    service.createMedicalConditions(newMedicalCondition).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/create`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should handle error while creating a medical condition', () => {
    const newMedicalCondition = {
      medicalConditionCode: 'MC1',
      medicalConditionName: 'Condition1',
      medicalConditionDescription: 'Description1',
      medicalConditionSymptoms: 'Symptoms1'
    };

    service.createMedicalConditions(newMedicalCondition).subscribe(
      () => fail('should have failed with the error'),
      (error) => {
        expect(error.message).toBe('Failed to create medical condition. Please try again later.');
      }
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/create`);
    expect(req.request.method).toBe('POST');
    req.flush('Error creating medical condition', { status: 500, statusText: 'Server Error' });
  });

  it('should update a medical condition', () => {
    const updatedMedicalCondition = {
      medicalConditionCode: 'MC1',
      medicalConditionName: 'Condition1',
      medicalConditionDescription: 'Description1',
      medicalConditionSymptoms: 'Symptoms1'
    };

    service.updateCondition('1', updatedMedicalCondition).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/update/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should handle error while updating a medical condition', () => {
    const updatedMedicalCondition = {
      medicalConditionCode: 'MC1',
      medicalConditionName: 'Condition1',
      medicalConditionDescription: 'Description1',
      medicalConditionSymptoms: 'Symptoms1'
    };

    service.updateCondition('1', updatedMedicalCondition).subscribe(
      () => fail('should have failed with the error'),
      (error) => {
        expect(error.message).toBe('Failed to update medical condition. Please try again later.');
      }
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/update/1`);
    expect(req.request.method).toBe('PUT');
    req.flush('Error updating medical condition', { status: 500, statusText: 'Server Error' });
  });
});
