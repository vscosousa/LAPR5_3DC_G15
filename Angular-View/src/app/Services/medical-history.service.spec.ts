import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MedicalHistoryService } from './medical-history.service';

describe('MedicalHistoryService', () => {
  let service: MedicalHistoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MedicalHistoryService]
    });
    service = TestBed.inject(MedicalHistoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch patient medical history', () => {
    const mockMedicalHistory = {
      patientMedicalRecordNumber: '123',
      medicalConditions: ['Condition1'],
      allergies: ['Allergy1'],
      familyHistory: ['FamilyHistory1'],
      freeText: 'Some free text'
    };

    service.getPatientMedicalHistory('123').subscribe(medicalHistory => {
      expect(medicalHistory).toEqual(mockMedicalHistory);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/get/123`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMedicalHistory);
  });

  it('should handle error while fetching patient medical history', () => {
    service.getPatientMedicalHistory('123').subscribe(
      () => fail('should have failed with the error'),
      (error) => {
        expect(error.status).toBe(404);
      }
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/get/123`);
    expect(req.request.method).toBe('GET');
    req.flush('Medical history not found', { status: 404, statusText: 'Not Found' });
  });

  it('should update patient medical history', () => {
    const updatedMedicalHistory = {
      medicalConditions: ['Condition1'],
      allergies: ['Allergy1'],
      familyHistory: ['FamilyHistory1'],
      freeText: 'Updated free text'
    };

    service.updatePatientMedicalHistory('123', updatedMedicalHistory.allergies, updatedMedicalHistory.medicalConditions, updatedMedicalHistory.familyHistory, updatedMedicalHistory.freeText).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/update/123`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should handle error while updating patient medical history', () => {
    const updatedMedicalHistory = {
      medicalConditions: ['Condition1'],
      allergies: ['Allergy1'],
      familyHistory: ['FamilyHistory1'],
      freeText: 'Updated free text'
    };

    service.updatePatientMedicalHistory('123', updatedMedicalHistory.allergies, updatedMedicalHistory.medicalConditions, updatedMedicalHistory.familyHistory, updatedMedicalHistory.freeText).subscribe(
      () => fail('should have failed with the error'),
      (error) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/update/123`);
    expect(req.request.method).toBe('PUT');
    req.flush('Error updating medical history', { status: 500, statusText: 'Server Error' });
  });
});
