import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * @class AuthInterceptor
 * @description Interceptor to add authentication token to HTTP requests.
 * @vscosousa - 12/11/2024
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /**
   * @constructor
   * @vscosousa - 12/11/2024
   */
  constructor() {
    console.log('AuthInterceptor instantiated');
  }

  /**
   * Intercepts HTTP requests to add authentication token.
   * @method intercept
   * @param {HttpRequest<any>} req - The outgoing HTTP request.
   * @param {HttpHandler} next - The next interceptor in the chain.
   * @returns {Observable<HttpEvent<any>>} - The HTTP event observable.
   * @vscosousa - 12/11/2024
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const nonAuthUrls = [
      '/login',
      '/register',
      '/delete-user'
    ];

    const isNonAuthUrl = nonAuthUrls.some(url => req.url.includes(url));
    console.log('Request URL:', req.url);
    console.log('Is Non-Auth URL:', isNonAuthUrl);

    let authToken = '';
    if (typeof window !== 'undefined' && localStorage) {
      authToken = localStorage.getItem('token') || '';
      console.log('Auth Token:', authToken);
    }

    if (authToken && !isNonAuthUrl) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
      console.log('Auth Request Headers:', authReq.headers);

      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
