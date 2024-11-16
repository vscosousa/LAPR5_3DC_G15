import { TestBed } from '@angular/core/testing';
import { HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { Observable, of } from 'rxjs';

// Test suite for AuthInterceptor
// Author: Vasco Sousa (1221700)
// Last Updated: 11/11/2024

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthInterceptor]
    });
    interceptor = TestBed.inject(AuthInterceptor);
  });

  // Test to check if the interceptor is created successfully
  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization header to requests', () => {
    const token = 'test-token';
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(token);

    const httpRequest = new HttpRequest('GET', '/api/test');
    const httpHandler: HttpHandler = {
      handle: jest.fn().mockReturnValue(of({} as HttpEvent<any>))
    };

    interceptor.intercept(httpRequest, httpHandler).subscribe(() => {
      expect(httpHandler.handle).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${token}`
          })
        })
      );
    });

    getItemSpy.mockRestore();
  });

  it('should not add Authorization header to non-auth URLs', () => {
    const httpRequest = new HttpRequest('GET', '/login');
    const httpHandler: HttpHandler = {
      handle: jest.fn().mockReturnValue(of({} as HttpEvent<any>))
    };

    interceptor.intercept(httpRequest, httpHandler).subscribe(() => {
      expect(httpHandler.handle).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.not.objectContaining({
            Authorization: expect.any(String)
          })
        })
      );
    });
  });

  it('should not add Authorization header if no token is found', () => {
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    const httpRequest = new HttpRequest('GET', '/api/test');
    const httpHandler: HttpHandler = {
      handle: jest.fn().mockReturnValue(of({} as HttpEvent<any>))
    };

    interceptor.intercept(httpRequest, httpHandler).subscribe(() => {
      expect(httpHandler.handle).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.not.objectContaining({
            Authorization: expect.any(String)
          })
        })
      );
    });

    getItemSpy.mockRestore();
  });
});
