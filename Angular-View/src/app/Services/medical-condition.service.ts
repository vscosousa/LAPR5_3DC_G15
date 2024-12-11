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
