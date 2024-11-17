/**
 * Service for handling user login and authentication.
 * Developed by: João Pereira(1211503)
 *
 * @service
 * @providedIn root
 *
 * @class LoginService
 *
 * @method login Logs in a user with the provided email and password.
 * @method getRoleFromToken Extracts the user role from the JWT token.
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'https://localhost:5001/api/user';

  constructor(private http: HttpClient) { }

  /**
   * Logs in a user with the provided email and password.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns {Observable<HttpResponse<string>>} An observable containing the HTTP response with the JWT token.
   */
  login(email: string, password: string): Observable<HttpResponse<string>> {
    const loginData = { email, password };
    return this.http.post<string>(`${this.apiUrl}/login`, loginData, {
      observe: 'response',
      responseType: 'text' as 'json'
    });
  }

  /**
   * Extracts the user role from the JWT token.
   * @param {string} token - The JWT token.
   * @returns {string} The user role extracted from the token.
   */
  getRoleFromToken(token: string): string {
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    return tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  }

  sendTokenToBackend(token: string): Observable<any> {
    const headers = { 'X-Skip-Interceptor': 'true' };
    return this.http.post(
      `${this.apiUrl}/Google`,
      { token },
      {
        headers,
        observe: 'response',
        responseType: 'text' as 'json'
      }
    );
  }
}
