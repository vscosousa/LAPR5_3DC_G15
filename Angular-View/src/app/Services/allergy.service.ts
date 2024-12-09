import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AllergyService {
  private apiUrl = 'http://localhost:4000/api/allergies';
  constructor(private http: HttpClient) { }

  getAllergies(): Observable<any[]> {
    console.log('getAllergies called');
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      catchError(error => {
        console.error('Error fetching allergies:', error);
        return of([]);
      })
    );
  }

  createAllergy(allergyName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, { allergyName });
  }
}
