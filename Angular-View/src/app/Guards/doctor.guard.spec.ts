import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { DoctorGuard } from './doctor.guard';
import { LoginService } from '../Services/login.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('DoctorGuard', () => {
  let guard: DoctorGuard;
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
        DoctorGuard,
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(DoctorGuard);
    loginService = TestBed.inject(LoginService) as jest.Mocked<LoginService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if user is doctor', () => {
    const token = 'valid-token';
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(token);
    loginService.getRoleFromToken.mockReturnValue('Doctor');

    const result = executeGuard({} as any, {} as any);
    expect(result).toBe(true);
  });

  it('should navigate to login if user is not doctor', () => {
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