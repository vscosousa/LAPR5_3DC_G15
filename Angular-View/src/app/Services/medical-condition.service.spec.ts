import { TestBed } from '@angular/core/testing';

import { MedicalConditionService } from './medica-condition.service';

describe('MedicalConditionService', () => {
  let service: MedicalConditionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicalConditionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
