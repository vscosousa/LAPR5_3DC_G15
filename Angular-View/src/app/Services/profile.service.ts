/** 
 * @class ProfileService
 * @description Service to handle profile-related API requests.
 * 
 * @method setProfileId
 * @description Sets the profile ID.
 * @returns {void}
 * 
 * @method getCode
 * @description Fetches a code for the given email.
 * @returns {Observable<any>} An observable containing the fetched code.
 * 
 * @date 22/12/2024
 * @autor Vasco Sousa (1221700)
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  /**
   * @constructor
   * @param {HttpClient} http - The HTTP client to make requests.
   * @vscosousa - 09/11/2024
   */
  constructor(
    private http: HttpClient
  ) { }
  private apiUrl = 'https://localhost:5001/api';
  private profileIdSource = new BehaviorSubject<string>('default-profile');
  profileId$ = this.profileIdSource.asObservable();

  /**
   * Sets the profile ID.
   * @method setProfileId
   * @param {string} profileId - The profile ID to set.
   * @vscosousa - 09/11/2024
   */
  setProfileId(profileId: string) {
    this.profileIdSource.next(profileId);
  }

  getCode(email: string): Observable<any> {
    const params = { email: email };
    return this.http.get<any>(`${this.apiUrl}/User/GetCode`, { params });
  }
}
