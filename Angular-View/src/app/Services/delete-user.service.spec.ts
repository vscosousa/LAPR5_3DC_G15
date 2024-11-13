import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DeleteUserService } from './delete-user.service';

// Test suite for DeleteUserService
// Author: Vasco Sousa (1221700)
// Last Updated: 12/11/2024

describe('DeleteUserService', () => {
  let service: DeleteUserService;

  beforeEach(() => {
    // Set up the testing module for DeleteUserService
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeleteUserService]
    });
    service = TestBed.inject(DeleteUserService);
  });

  // Test to check if the service is created successfully
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
