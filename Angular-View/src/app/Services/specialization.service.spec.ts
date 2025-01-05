/**
 * Test for the service class that is managing specializations.
 * 
 * 
 * US Developed By: João Pereira - 1211503
 * Finished at 06/12/2024 
 * 
 * 
 * @service
 * @class SpecializationService
 * 
 * 
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SpecializationService } from './specialization.service';

describe('SpecializationService', () => {
  let service: SpecializationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(SpecializationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
