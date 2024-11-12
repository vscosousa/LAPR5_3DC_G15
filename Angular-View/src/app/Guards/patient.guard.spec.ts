import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { PatientGuard } from './patient.guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => {
        const guard = TestBed.inject(PatientGuard);
        return guard.canActivate(...guardParameters);
      });

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
