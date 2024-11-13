/**
 * Service for managing operation types and their associated data.
 * Developed by: João Pereira - 1211503
 * 
 * @service
 * @providedIn root
 * 
 * @class OperationTypeService
 * 
 * @method getOperationTypes Fetches all operation types from the backend.
 * @method getSpecializations Fetches all specializations from the backend.
 * @method createOperationType Creates a new operation type.
 * @method getStaffs Fetches staff members for a specific specialization.
 * @method editOperationType Edits an existing operation type.
 * @method getOperationTypeByName Fetches an operation type by its name.
 * @method deactivateOperationTypeByName Deactivates an operation type by its name.
 * @method activateOperationTypeByName Activates an operation type by its name.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperationTypeService {
  deleteOperationType(operationTypeName: string) {
    throw new Error('Method not implemented.');
  }

  private apiUrl = 'https://localhost:5001/api';

  constructor(private http: HttpClient) { }

  /**
   * Fetches all operation types from the backend.
   * @returns {Observable<any[]>} An observable containing the list of operation types.
   */
  getOperationTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/OperationType`);
  }

  /**
   * Fetches all specializations from the backend.
   * @returns {Observable<any[]>} An observable containing the list of specializations.
   */
  getSpecializations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Specialization`);
  }

  /**
   * Creates a new operation type.
   * @param {object} operationType - The operation type data.
   * @param {string} operationType.name - The name of the operation type.
   * @param {string} operationType.estimatedDuration - The estimated duration of the operation type.
   * @param {any[]} operationType.specializations - The specializations associated with the operation type.
   * @returns {Observable<any>} An observable containing the created operation type.
   */
  createOperationType(operationType: { name: string; estimatedDuration: string; specializations: any[]; }): Observable<any> {
    return this.http.post(`${this.apiUrl}/OperationType`, operationType);
  }

  /**
   * Fetches staff members for a specific specialization.
   * @param {string} specOption - The specialization option.
   * @returns {Observable<any[]>} An observable containing the list of staff members.
   */
  getStaffs(specOption: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Specialization/staff/${encodeURIComponent(specOption)}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching staff:', error);
          return throwError(() => new Error('Failed to fetch staff members'));
        })
      );
  }

  /**
   * Edits an existing operation type.
   * @param {string} operationTypeName - The name of the operation type to edit.
   * @param {object} operationType - The updated operation type data.
   * @param {string} operationType.name - The name of the operation type.
   * @param {string} operationType.estimatedDuration - The estimated duration of the operation type.
   * @param {any[]} operationType.specializations - The specializations associated with the operation type.
   * @returns {Observable<any>} An observable containing the updated operation type.
   */
  editOperationType(operationTypeName: string, operationType: { name: string; estimatedDuration: string; specializations: any[] }): Observable<any> {
    return this.http.put(`${this.apiUrl}/OperationType/${operationTypeName}`, operationType);
  }

  /**
   * Fetches an operation type by its name.
   * @param {string} operationTypeName - The name of the operation type to fetch.
   * @returns {Observable<any>} An observable containing the operation type data.
   */
  getOperationTypeByName(operationTypeName: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/OperationType/name/${operationTypeName}`);
  }

  /**
   * Deactivates an operation type by its name.
   * @param {string} operationTypeName - The name of the operation type to deactivate.
   * @returns {Observable<any>} An observable containing the response from the backend.
   */
  deactivateOperationTypeByName(operationTypeName: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/OperationType/deactivate/${operationTypeName}`, {}, { responseType: 'text' })
      .pipe(
        catchError(error => {
          console.error('Deactivation failed:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Activates an operation type by its name.
   * @param {string} operationTypeName - The name of the operation type to activate.
   * @returns {Observable<any>} An observable containing the response from the backend.
   */
  activateOperationTypeByName(operationTypeName: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/OperationType/activate/${operationTypeName}`, {}, { responseType: 'text' })
      .pipe(
        catchError(error => {
          console.error('Activation failed:', error);
          return throwError(() => error);
        })
      );
  }
}