import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginService } from '../Services/login.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;
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
        AuthGuard,
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    loginService = TestBed.inject(LoginService) as jest.Mocked<LoginService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if user is admin', () => {
    const token = 'valid-token';
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(token);
    loginService.getRoleFromToken.mockReturnValue('Admin');

    const result = executeGuard({} as any, {} as any);
    expect(result).toBe(true);
  });

  it('should navigate to login if user is not admin', () => {
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
