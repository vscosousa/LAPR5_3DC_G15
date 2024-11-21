import { TestBed } from '@angular/core/testing';

import { Hospital3dService } from './hospital3d.service';

describe('Hospital3dService', () => {
  let service: Hospital3dService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Hospital3dService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
