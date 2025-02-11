/**
 * @fileoverview MedicalHistoryService
 * @description Service to handle medical history-related API requests.
 * 
 * @class MedicalHistoryService
 * @description Service to handle medical history-related API requests.
 * 
 * @method getPatientMedicalHistory
 * @description Fetches the medical history of a specific patient by their medical record number.
 * @returns {Observable<any>} An observable containing the patient's medical history.
 * 
 * @method updatePatientMedicalHistory
 * @description Updates the medical history of a specific patient.
 * @returns {Observable<any>} An observable containing the updated medical history.
 * 
 * @date 11/12/2024
 * @author Vasco Sousa (1221700)
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicalHistoryService {

  private apiUrl = 'http://localhost:4000/api/patientsMedicalHistory';

  constructor(private http: HttpClient) { }

  getPatientMedicalHistory(patientMedicalRecordNumber: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get/${patientMedicalRecordNumber}`).pipe(
      tap((response: any) => console.log('Medical history response:', response)),
      catchError((error: any) => {
        if (error.status === 404) {
          console.error('Medical history not found:', error);
        }
        return throwError(() => error);
      })
    );
  }

   updatePatientMedicalHistory(patientMedicalRecordNumber: string, allergies: string[], medicalConditions: string[], familyHistory: string[], freeText: string): Observable<any> {
    const url = `${this.apiUrl}/update/${patientMedicalRecordNumber}`;
    const body = {
      medicalConditions: medicalConditions,
      allergies: allergies,
      familyHistory: familyHistory, // Ensure this is an array of strings
      freeText: freeText
    };
    return this.http.put<any>(url, body).pipe(
      tap((response: any) => console.log('Update response:', response)),
      catchError((error: any) => {
        console.error('Error updating medical history:', error);
        return throwError(() => error);
      })
    );
  }
}
