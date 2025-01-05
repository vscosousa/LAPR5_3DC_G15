/**
 * @class MedicalConditionService
 * @description Service to handle medical condition-related API requests.
 * 
 * @author Vasco Sousa (1221700)
 * @date 11/12/2024
 * 
 * @method getMedicalConditions
 * @description Fetches all medical conditions from the API.
 * @returns {Observable<any[]>} An observable containing an array of medical conditions.
 * 
 * @method createMedicalConditions
 * @description Creates a new medical condition.
 * @returns {Observable<any>} An observable containing the created medical condition.
 * 
 * @method updateCondition
 * @description Updates an existing medical condition.
 * @returns {Observable<any>} An observable containing the updated medical condition.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicalConditionService {
  private apiUrl = 'http://localhost:4000/api/medicalConditions';
  constructor(private http: HttpClient) { }

  getMedicalConditions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
  }

  createMedicalConditions(medicalCondition: { medicalConditionCode: string, medicalConditionName: string, medicalConditionDescription: string, medicalConditionSymptoms: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, { medicalConditionCode: medicalCondition.medicalConditionCode, medicalConditionName: medicalCondition.medicalConditionName, medicalConditionDescription: medicalCondition.medicalConditionDescription, medicalConditionSymptoms: medicalCondition.medicalConditionSymptoms }).pipe(
      catchError(error => {
        console.error('Error creating medical condition:', error);
        return throwError(() => new Error('Failed to create medical condition. Please try again later.'));
      })
    );
  }

    updateCondition(id: string, medicalCondition: any) {
      return this.http.put<any>(`${this.apiUrl}/update/${id}`, {
        medicalConditionCode: medicalCondition.medicalConditionCode,
        medicalConditionName: medicalCondition.medicalConditionName,
        medicalConditionDescription: medicalCondition.medicalConditionDescription,
        medicalConditionSymptoms: medicalCondition.medicalConditionSymptoms
      }).pipe(
        catchError(error => {
          console.error('Error updating medical condition:', error);
          return throwError(() => new Error('Failed to update medical condition. Please try again later.'));
        })
      );
    }
}
