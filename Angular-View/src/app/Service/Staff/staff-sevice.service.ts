import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class StaffService {
  private apiUrl = 'https://localhost:5001/api/staff'; 
  formSubmitted: boolean = false;

  constructor(private http: HttpClient) { }

  createStaff(firstName: string, lastName: string, fullName: string, email: string, phoneNumber: string, staffType: string, specializationName: string): Observable<HttpResponse<string>> {
    const CreateStaff = {
      firstName,
      lastName,
      fullName,
      email,
      phoneNumber,
      staffType,
      specializationName
    }

    return this.http.post<string>(`${this.apiUrl}`, CreateStaff, {
      observe: 'response',
      responseType: 'text' as 'json'
    });
  }

  resetForm() {

    this.formSubmitted = false;
  }
}