import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { PatientGuard } from './patient.guard';

// Test suite for PatientGuard
// Author: Vasco Sousa (1221700)
// Last Updated: 12/11/2024

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => {
        const guard = TestBed.inject(PatientGuard);
        return guard.canActivate(...guardParameters);
      });

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  // Test to check if the guard is created successfully
  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
