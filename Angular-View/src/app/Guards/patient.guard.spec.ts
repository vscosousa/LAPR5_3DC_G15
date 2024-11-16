import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { PatientGuard } from './patient.guard';
import { LoginService } from '../Services/login.service';
import { RouterTestingModule } from '@angular/router/testing';

// Test suite for PatientGuard
// Author: Vasco Sousa (1221700)
// Last Updated: 12/11/2024

describe('PatientGuard', () => {
  let guard: PatientGuard;
  let loginService: jest.Mocked<LoginService>;
  let router: jest.Mocked<Router>;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => {
      return guard.canActivate(...guardParameters);
    });

  beforeEach(() => {
    const loginServiceSpy = {
      getRoleFromToken: jest.fn()
    };
    const routerSpy = {
      navigate: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        PatientGuard,
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(PatientGuard);
    loginService = TestBed.inject(LoginService) as jest.Mocked<LoginService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  // Test to check if the guard is created successfully
  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if user is patient', () => {
    const token = 'valid-token';
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(token);
    loginService.getRoleFromToken.mockReturnValue('Patient');

    const result = executeGuard({} as any, {} as any);
    expect(result).toBe(true);
  });

  it('should navigate to login if user is not patient', () => {
    const token = 'valid-token';
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(token);
    loginService.getRoleFromToken.mockReturnValue('User');

    const result = executeGuard({} as any, {} as any);
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to login if no token is found', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    const result = executeGuard({} as any, {} as any);
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
