import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Specialization {
  id: string;
  specializationType: string;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  isFailure: boolean;
  error: string | null;
  _value: T;
}

@Injectable({
  providedIn: 'root'
})

export class SpecializationService {


  constructor(private http: HttpClient) { }

  private url = 'http://localhost:4000/api/specializations';

  getSpecializations(): Observable<ApiResponse<Specialization[]>> {

    return this.http.get<ApiResponse<Specialization[]>>(this.url);

  }

  createSpecialization(specialization: Partial<Specialization>): Observable<Specialization> {
    return this.http.post<Specialization>(`${this.url}/create`, specialization);
  }

  updateSpecialization(id: string, specialization: Partial<Specialization>): Observable<Specialization> {
    return this.http.put<Specialization>(`${this.url}/update/${id}`, specialization);
  }

  deleteSpecialization(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${id}`);
  }

}
