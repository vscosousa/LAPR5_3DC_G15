/**
 * Service for managing operation requests and their associated data.
 * Developed by: Tiago Sousa - 1150736
 *
 * @service
 * @providedIn root
 *
 * @class OperationRequestService
 *
 * @method getOperationRequests Fetches all operation requests from the backend.
 * @method getOperationTypes Fetches all operation types from the backend.
 * @method createOperationRequest Creates a new operation request.
 * @method getPatient Fetches patient member for the operation request.
 * @method getStaffs Fetches staff members for a specific specialization.
 * @method editOperationRequest Edits an existing operation request.
 * @method getOperationRequestByName Fetches an operation request by its name.
 * @method deleteOperationRequestByName Deletes an operation request by its name.
 */

import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OperationRequestService {
  /**
   * Edits an existing operation type.
   * @param {string} operationRequestName - The name of the operation request to edit.
   * @param {object} operationRequest - The updated operation type data.
   * @param {string} operationRequest.name - The name of the operation request.
   * @param {string} operationRequest.patient
   * @returns {Observable<any>} An observable containing the updated operation type.
   */

  private apiUrl = 'https://localhost:5001/api';

  constructor(private http: HttpClient) { }

  getOperationTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/OperationType`);
  }

  createOperationRequest(operationRequestData: { deadlineDate: string, priority: string, medicalRecordNumber: string, doctorLicenseNumber: string, operationType: string }) {
    console.log(operationRequestData);
    return this.http.post<any>(`${this.apiUrl}/OperationRequest`, operationRequestData).pipe(
      catchError((error: any) => {
        console.error('Error creating operation request:', error);
        return throwError(error);
      })
    );
  }

  editOperationRequest(operationRequestId: string, operationRequest: { deadlineDate: string, priority: string }): Observable<any> {
    console.log(operationRequestId);
    return this.http.put<any>(`${this.apiUrl}/OperationRequest/${operationRequestId}`, operationRequest, { responseType: 'json' }).pipe(
      catchError((error: any) => {
        console.error('Error editing operation request:', error);
        return throwError(error);
      })
    );
  }

  /**
   * Fetches all operation requests from the backend.
   * @returns {Observable<any[]>} An observable containing the list of operation requests.
   */
  getOperationRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/operationRequest`)
      .pipe(
        catchError(error => {
          console.error('Error fetching operation requests:', error);
          return throwError(() => new Error('Failed to fetch operation requests'));
        })
      );
  }

  /**updateOperationRequest(id : string, operationRequest {deadline: string; doctorLicenseNumber:  string; operationType : number; patientName : string; priority : string}) {
    return this.http.put<any>(`${this.apiUrl}/OperationRequest/${id}`, operationRequest, { responseType: 'json' }).pipe(
      catchError((error: any) => {
        console.error('Error updating operationRequest:', error);
        return throwError(error);
      })
    );
  }**/

  deleteOperationRequest(id: string, doctorLicenseNumber: string): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.apiUrl}/OperationRequest/${id}?doctorLicenseNumber=${doctorLicenseNumber}`, {
      observe: 'response'
    }).pipe(
      catchError((error: any) => {
        console.error('Error deleting operation request:', error);
        return throwError(error);
      })
    );
  }

  getOperationRequestsWithAdvancedFilter(
    operationRequest?: string,
    doctorLicenseNumber?: string,
    operationType?: string,
    deadlineDate?: string,
    patientMedicalRecordNumber?: string,
    priority?: string,
  ): Observable<any[]> {
    let queryParams = new URLSearchParams({
      operationRequest: operationRequest || '',
      doctorLicenseNumber: doctorLicenseNumber || '',
      operationType: operationType || '',
      deadlineDate: deadlineDate || '',
      patientMedicalRecordNumber: patientMedicalRecordNumber || '',
      priority: priority || '',
    });

    return this.http.get<any[]>(`${this.apiUrl}/OperationRequest?${queryParams.toString()}`);
  }

}
