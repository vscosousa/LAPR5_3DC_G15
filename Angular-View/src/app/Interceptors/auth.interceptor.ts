import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginService } from '../Services/login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private loginService: LoginService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem('token');

    const nonAuthUrls = [
      '/login',
      '/register'
    ];

    const isNonAuthUrl = nonAuthUrls.some(url => req.url.includes(url));

    if (authToken && !isNonAuthUrl) {
      const role = authToken ? this.loginService.getRoleFromToken(authToken) : null;

      
      if (req.url.includes('/operation-types') && role !== 'Admin') {
        this.router.navigate(['/unauthorized']);  // Redirect if not "Admin"
        return throwError(() => new Error('Unauthorized'));
      }

      
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });

      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 || error.status === 403) {
            this.router.navigate(['/unauthorized']);
          }
          return throwError(() => error);
        })
      );
    }

    
    return next.handle(req);
  }
}
