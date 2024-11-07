import { TestBed } from '@angular/core/testing';

import { StaffService } from './staff-sevice.service';

describe('StaffSeviceService', () => {
  let service: StaffService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
