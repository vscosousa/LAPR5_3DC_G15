import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * @class ActivateUserService
 * @description Service to handle user activation operations.
 * @vscosousa - 12/11/2024
 */
@Injectable({
  providedIn: 'root'
})
export class ActivateUserService {
  private apiUrl = 'https://localhost:5001/api/user';

  /**
   * @constructor
   * @param {HttpClient} http - The HTTP client to make requests.
   * @vscosousa - 12/11/2024
   */
  constructor(private http: HttpClient) { }

  /**
   * Activates a user account based on the provided token.
   * @method activateAccount
   * @param {string} token - The token to authenticate the activation request.
   * @returns {Observable<HttpResponse<any>>} - The HTTP response observable.
   * @vscosousa - 12/11/2024
   */
  activateAccount(token: string): Observable<HttpResponse<any>> {
    localStorage.removeItem('authToken');
    return this.http.post<any>(`${this.apiUrl}/ActivatePatientUser?token=${token}`, {}, {
      observe: 'response'
    }).pipe(
      catchError((error: any) => {
        console.error('Error activating account:', error);
        return throwError(error);
      })
    );
  }
}
