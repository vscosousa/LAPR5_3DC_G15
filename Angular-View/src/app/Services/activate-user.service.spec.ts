import { TestBed } from '@angular/core/testing';

import { ActivateUserService } from './activate-user.service';

describe('ActivateUserService', () => {
  let service: ActivateUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivateUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
