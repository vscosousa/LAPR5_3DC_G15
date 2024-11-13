import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * @class RegisterService
 * @description Service to handle user registration operations.
 * @vscosousa - 07/11/2024
 */
@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'https://localhost:5001/api/user';

  /**
   * @constructor
   * @param {HttpClient} http - The HTTP client to make requests.
   * @vscosousa - 07/11/2024
   */
  constructor(private http: HttpClient) { }

  /**
   * Registers a new user.
   * @method register
   * @param {string} email - The email of the user.
   * @param {string} identifier - The identifier (e.g., country code) of the user.
   * @param {string} phoneNumber - The phone number of the user.
   * @param {string} password - The password of the user.
   * @returns {Observable<HttpResponse<string>>} - The HTTP response observable.
   * @vscosousa - 07/11/2024
   */
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
