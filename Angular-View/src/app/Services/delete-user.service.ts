import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeleteUserService {
  private apiUrl = 'https://localhost:5001/api/user';

  constructor(private http: HttpClient) { }

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
