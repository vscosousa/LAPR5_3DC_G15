import { TestBed } from '@angular/core/testing';
import { HttpHandler, HttpRequest } from '@angular/common/http';

import { AuthInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let interceptor: (req: HttpRequest<any>, next: HttpHandler) => any;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    const authInterceptor = new AuthInterceptor();
    interceptor = (req, next) => TestBed.runInInjectionContext(() => authInterceptor.intercept(req, next));
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
