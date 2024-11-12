import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class StaffService {
  private apiUrl = 'https://localhost:5001/api/staff'; 
  private apiURLSpecializaction = 'https://localhost:5001/api/specialization';

  constructor(private http: HttpClient) { }

  createStaff(firstName: string, lastName: string, fullName: string, email: string, identifier: string, phoneNumber: string, staffType: string, specializationName: string): Observable<HttpResponse<string>> {
    const CreateStaff = {
      firstName,
      lastName,
      fullName,
      email,
      phoneNumber: identifier + phoneNumber,
      staffType,
      specializationName
    }

    console.log(CreateStaff);

    return this.http.post<string>(`${this.apiUrl}`, CreateStaff, {
      observe: 'response',
      responseType: 'text' as 'json'
    });
    
  }

  getSpecialization(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURLSpecializaction}`);
  }
}