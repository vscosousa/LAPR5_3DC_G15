import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SettingsService } from './settings.service';

// Test suite for SettingsService
// Author: Vasco Sousa (1221700)
// Last Updated: 09/11/2024

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(() => {
    // Set up the testing module for SettingsService
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(SettingsService);
  });

  // Test to check if the service is created successfully
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
