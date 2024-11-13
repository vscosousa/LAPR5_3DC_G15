import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'https://localhost:5001/api';

  constructor(private http: HttpClient) { }

  deletePatient(patientId: string): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.apiUrl}/Patient/${patientId}`, {
      observe: 'response'
    }).pipe(
      catchError((error: any) => {
        console.error('Error deleting patient:', error);
        return throwError(error);
      })
    );
  }

  getPatientsWithAdvancedFilter(
    firstName?: string,
    lastName?: string,
    fullName?: string,
    dateOfBirth?: string,
    medicalRecordNumber?: string,
    gender?: string,
    email?: string,
    phoneNumber?: string
  ): Observable<any[]> {
    let queryParams = new URLSearchParams({
      firstName: firstName || '',
      lastName: lastName || '',
      fullName: fullName || '',
      dateOfBirth: dateOfBirth || '',
      medicalRecordNumber: medicalRecordNumber || '',
      gender: gender || '',
      email: email || '',
      phoneNumber: phoneNumber || ''
    });

    return this.http.get<any[]>(`${this.apiUrl}/Patient?${queryParams.toString()}`);
  }

  createPatient(newPatient: { firstName: string; lastName: string; fullName: string; dateOfBirth: string; genderOptions: string; email: string; phoneNumber: string; emergencyContact: string; medicalConditions: string; }) {
    return this.http.post<any>(`${this.apiUrl}/Patient`, newPatient).pipe(
      catchError((error: any) => {
        console.error('Error creating patient:', error);
        return throwError(error);
      })
    );
  }
}
