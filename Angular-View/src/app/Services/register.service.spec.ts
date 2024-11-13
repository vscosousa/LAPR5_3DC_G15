import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RegisterService } from './register.service';

// Test suite for RegisterService
// Author: Vasco Sousa (1221700)
// Last Updated: 07/11/2024

describe('RegisterService', () => {
  let service: RegisterService;

  beforeEach(() => {
    // Set up the testing module for RegisterService
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(RegisterService);
  });

  // Test to check if the service is created successfully
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
