import { TestBed } from '@angular/core/testing';
import { HttpHandler, HttpRequest } from '@angular/common/http';

import { AuthInterceptor } from './auth.interceptor';

// Test suite for AuthInterceptor
// Author: Vasco Sousa (1221700)
// Last Updated: 11/11/2024

describe('authInterceptor', () => {
  let interceptor: (req: HttpRequest<any>, next: HttpHandler) => any;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    const authInterceptor = new AuthInterceptor();
    interceptor = (req, next) => TestBed.runInInjectionContext(() => authInterceptor.intercept(req, next));
  });

  // Test to check if the interceptor is created successfully
  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
