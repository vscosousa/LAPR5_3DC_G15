import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AllergyService } from './allergy.service';

describe('AllergyService', () => {
  let service: AllergyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AllergyService]
    });
    service = TestBed.inject(AllergyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch allergies', () => {
    const mockAllergies = [
      { allergyCode: 'A1', allergyName: 'Peanut', allergyDescription: 'Peanut allergy', allergySymptoms: 'Hives, swelling' }
    ];

    service.getAllergies().subscribe(allergies => {
      expect(allergies).toEqual(mockAllergies);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAllergies);
  });

  it('should handle error while fetching allergies', () => {
    service.getAllergies().subscribe(
      allergies => {
        expect(allergies).toEqual([]);
      },
      () => fail('should have succeeded with an empty array')
    );

    const req = httpMock.expectOne(`${service['apiUrl']}`);
    expect(req.request.method).toBe('GET');
    req.flush('Error fetching allergies', { status: 500, statusText: 'Server Error' });
  });

  it('should create an allergy', () => {
    const newAllergy = {
      allergyCode: 'A1',
      allergyName: 'Peanut',
      allergyDescription: 'Peanut allergy',
      allergySymptoms: 'Hives, swelling'
    };

    service.createAllergy(newAllergy).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/create`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should handle error while creating an allergy', () => {
    const newAllergy = {
      allergyCode: 'A1',
      allergyName: 'Peanut',
      allergyDescription: 'Peanut allergy',
      allergySymptoms: 'Hives, swelling'
    };

    service.createAllergy(newAllergy).subscribe(
      () => fail('should have failed with the error'),
      (error) => {
        expect(error.message).toBe('Failed to create Allergy. Please try again later.');
      }
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/create`);
    expect(req.request.method).toBe('POST');
    req.flush('Error creating allergy', { status: 500, statusText: 'Server Error' });
  });

  it('should update an allergy', () => {
    const updatedAllergy = {
      allergyCode: 'A1',
      allergyName: 'Peanut',
      allergyDescription: 'Peanut allergy',
      allergySymptoms: 'Hives, swelling'
    };

    service.updateAllergy('1', updatedAllergy).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/update/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should handle error while updating an allergy', () => {
    const updatedAllergy = {
      allergyCode: 'A1',
      allergyName: 'Peanut',
      allergyDescription: 'Peanut allergy',
      allergySymptoms: 'Hives, swelling'
    };

    service.updateAllergy('1', updatedAllergy).subscribe(
      () => fail('should have failed with the error'),
      (error) => {
        expect(error.message).toBe('Failed to update allergy. Please try again later.');
      }
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/update/1`);
    expect(req.request.method).toBe('PUT');
    req.flush('Error updating allergy', { status: 500, statusText: 'Server Error' });
  });
});
