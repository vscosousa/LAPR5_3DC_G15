import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * @class DeleteUserService
 * @description Service to handle user deletion operations.
 * @vscosousa - 12/11/2024
 */
@Injectable({
  providedIn: 'root'
})
export class DeleteUserService {
  private apiUrl = 'https://localhost:5001/api/user';

  /**
   * @constructor
   * @param {HttpClient} http - The HTTP client to make requests.
   * @vscosousa - 12/11/2024
   */
  constructor(private http: HttpClient) { }

  /**
   * Deletes a user account based on the provided token.
   * @method deleteAccount
   * @param {string} token - The token to authenticate the deletion request.
   * @returns {Observable<HttpResponse<any>>} - The HTTP response observable.
   * @vscosousa - 12/11/2024
   */
  deleteAccount(token: string): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.apiUrl}/DeleteUser/${token}`, {
      observe: 'response'
    }).pipe(
      catchError((error: any) => {
        console.error('Error deleting account:', error);
        return throwError(error);
      })
    );
  }
}
