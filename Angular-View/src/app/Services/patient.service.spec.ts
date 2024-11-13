import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PatientService } from './patient.service';

// Test suite for PatientService
// Author: Vasco Sousa (1221700)
// Last Updated: 12/11/2024

describe('PatientService', () => {
  let service: PatientService;

  beforeEach(() => {
    // Set up the testing module for PatientService
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PatientService]
    });
    service = TestBed.inject(PatientService);
  });

  // Test to check if the service is created successfully
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
