import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicalConditionService {
  private apiUrl = 'http://localhost:4000/api/medicalConditions';
  constructor(private http: HttpClient) { }

  getMedicalConditions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
  }

  createMedicalConditions(medicalConditionName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, { medicalConditionName });
  }
}
