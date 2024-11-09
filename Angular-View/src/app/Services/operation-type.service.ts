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

  getOperationTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/OperationType`);
  }

  getSpecializations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Specialization`);
  }
  createOperationType(operationType: { name: string; estimatedDuration: string; specializations: any[]; }) {
    return this.http.post(`${this.apiUrl}/OperationType`, operationType);
  }

  getStaffs(specOption: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Specialization/staff/${specOption}`);
  }

  editOperationType(operationTypeName:string, operationType: { name: string; estimatedDuration: string; specializations: any[] }) {
    return this.http.put(`${this.apiUrl}/OperationType/${operationTypeName}`, operationType);
  }

  getOperationTypeByName(operationTypeName: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/OperationType/${operationTypeName}`);
  }

  deactivateOperationTypeByName(operationTypeName: string) {
    return this.http.put(`${this.apiUrl}/OperationType/deactivate/${operationTypeName}`, {}, { responseType: 'text' })
      .pipe(
        catchError(error => {
          console.error('Deactivation failed:', error);
          return throwError(() => error);
        })
      );
  }

  activateOperationTypeByName(operationTypeName: string) {
    return this.http.put(`${this.apiUrl}/OperationType/activate/${operationTypeName}`, {}, { responseType: 'text' })
      .pipe(
        catchError(error => {
          console.error('activation failed:', error);
          return throwError(() => error);
        })
      );
  }
}
