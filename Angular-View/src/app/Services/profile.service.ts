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
