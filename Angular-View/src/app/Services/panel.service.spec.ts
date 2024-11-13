import { TestBed } from '@angular/core/testing';

import { PanelService } from './panel.service';

// Test suite for PanelService
// Author: Vasco Sousa (1221700)
// Last Updated: 09/11/2024

describe('PanelService', () => {
  let service: PanelService;

  beforeEach(() => {
    // Set up the testing module for PanelService
    TestBed.configureTestingModule({});
    service = TestBed.inject(PanelService);
  });

  // Test to check if the service is created successfully
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
