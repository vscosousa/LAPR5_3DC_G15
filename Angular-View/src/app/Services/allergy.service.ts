/**
 * @fileoverview AllergyService
 * @description Service to handle allergy-related API requests.
 * @author Vasco Sousa (1221700)
 * @date 11/12/2024
 * 
 * @method getAllergies
 * @description Fetches all allergies from the API.
 * @returns {Observable<any[]>} An observable containing an array of allergies.
 * 
 * @method createAllergy
 * @description Creates a new allergy.
 * @returns {Observable<any>} An observable containing the created allergy.
 * 
 * @method updateAllergy
 * @description Updates an existing allergy.
 * @returns {Observable<any>} An observable containing the updated allergy.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
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

  createAllergy(allergy: { allergyCode: string, allergyName: string, allergyDescription: string, allergySymptoms: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, { allergyCode: allergy.allergyCode, allergyName: allergy.allergyName, allergyDescription: allergy.allergyDescription, allergySymptoms: allergy.allergySymptoms })
      .pipe(
        catchError(error => {
          console.error('Error creating allergy:', error);
          return throwError(() => new Error('Failed to create Allergy. Please try again later.'));
        })
      );
  }

    updateAllergy(id: string, allergy: { allergyCode: string; allergyName: string; allergyDescription: string; allergySymptoms: string; }) {
      return this.http.put<any>(`${this.apiUrl}/update/${id}`, {
        allergyCode: allergy.allergyCode,
        allergyName: allergy.allergyName,
        allergyDescription: allergy.allergyDescription,
        allergySymptoms: allergy.allergySymptoms
      }).pipe(
        catchError(error => {
          console.error('Error updating allergy:', error);
          return throwError(() => new Error('Failed to update allergy. Please try again later.'));
        })
      );
    }
}
