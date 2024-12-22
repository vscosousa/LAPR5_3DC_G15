import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

/**
 * @class PatientService
 * @description Service to handle patient-related operations.
 * @vscosousa - 12/11/2024
 */
@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'https://localhost:5001/api';

  /**
   * @constructor
   * @param {HttpClient} http - The HTTP client to make requests.
   * @vscosousa - 12/11/2024
   */
  constructor(private http: HttpClient) { }

  /**
   * Deletes a patient based on the provided patient ID.
   * @method deletePatient
   * @param {string} patientId - The ID of the patient to be deleted.
   * @returns {Observable<HttpResponse<any>>} - The HTTP response observable.
   * @vscosousa - 12/11/2024
   */
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

  /**
   * Fetches patients with advanced filters.
   * @method getPatientsWithAdvancedFilter
   * @param {string} [firstName] - The first name of the patient.
   * @param {string} [lastName] - The last name of the patient.
   * @param {string} [fullName] - The full name of the patient.
   * @param {string} [dateOfBirth] - The date of birth of the patient.
   * @param {string} [medicalRecordNumber] - The medical record number of the patient.
   * @param {string} [gender] - The gender of the patient.
   * @param {string} [email] - The email of the patient.
   * @param {string} [phoneNumber] - The phone number of the patient.
   * @returns {Observable<any[]>} - The observable containing the list of patients.
   * @vscosousa - 12/11/2024
   */
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

  getMyProfile(emailAddress: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Patient/myProfile/${emailAddress}`);
  }

  /**
   * Creates a new patient.
   * @method createPatient
   * @param {Object} newPatient - The details of the new patient.
   * @returns {Observable<any>} - The observable containing the response.
   * @vscosousa - 12/11/2024
   */
  createPatient(newPatient: { firstName: string; lastName: string; fullName: string; dateOfBirth: string; genderOptions: string; email: string; phoneNumber: string; emergencyContact: string; allergies: string[]; medicalConditions: string[]; familyHistory: { relationship: string; conditions: string[]; }[]; freeText: string; }) {
    return this.http.post<any>(`${this.apiUrl}/Patient`, newPatient).pipe(
      catchError((error: any) => {
        console.error('Error creating patient:', error);
        return throwError(error);
      })
    );
  }
  /**
   * Updates an existing patient.
   * @method updatePatient
   * @param {Object} existingPatient - The details of the existing patient.
   * @returns {Observable<any>} - The observable containing the response.
   * @vscosousa - 12/11/2024
   */
  updatePatient(medicalRecordNumber: string, patient: { firstName: string; lastName: string; fullName: string; email: string; phoneNumber: string; emergencyContact: string; }) {
    return this.http.put<any>(`${this.apiUrl}/Patient/${medicalRecordNumber}`, patient, { responseType: 'json' }).pipe(
      catchError((error: any) => {
        console.error('Error updating patient:', error);
        return throwError(error);
      })
    );
  }
}
