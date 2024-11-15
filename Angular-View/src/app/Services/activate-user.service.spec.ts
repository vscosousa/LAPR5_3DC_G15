import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ActivateUserService } from './activate-user.service';

describe('ActivateUserService', () => {
  let service: ActivateUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ActivateUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
