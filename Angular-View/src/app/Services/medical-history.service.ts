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

  updatePatientMedicalHistory(patientMedicalRecordNumber: string, allergies: string[], medicalConditions: string[]): Observable<any> {
    const url = `${this.apiUrl}/update/${patientMedicalRecordNumber}`;
    const body = {
      allergies: allergies,
      medicalConditions: medicalConditions
    };
    return this.http.put(url, body);
  }
}
