import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'https://localhost:5001/api/user'; 

  constructor(private http: HttpClient) { }

  register(email: string, identifier: string, phoneNumber: string, password: string): Observable<HttpResponse<string>> {
    const registerData = { 
      email, 
      phoneNumber: identifier + phoneNumber, 
      password 
    };
    console.log('Registering user', registerData);
    return this.http.post<string>(`${this.apiUrl}/RegisterUserAsPatient`, registerData, {
      observe: 'response',
      responseType: 'text' as 'json'
    });
  }
}