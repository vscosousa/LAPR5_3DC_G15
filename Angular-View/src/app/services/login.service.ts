import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'https://localhost:5001/api/user'; 

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<HttpResponse<string>> {
    const loginData = { email, password };
    return this.http.post<string>(`${this.apiUrl}/login`, loginData, {
      observe: 'response',
      responseType: 'text' as 'json'
    });
  }
}