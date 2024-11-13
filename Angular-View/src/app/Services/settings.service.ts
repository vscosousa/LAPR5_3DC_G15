import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * @class SettingsService
 * @description Service to handle settings-related operations.
 * @vscosousa - 12/11/2024
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = 'https://localhost:5001/api/user';

  /**
   * @constructor
   * @param {HttpClient} http - The HTTP client to make requests.
   * @vscosousa - 09/11/2024
   */
  constructor(private http: HttpClient) { }

  private settingsIdSource = new BehaviorSubject<string>('default-settings');
  settingsId$ = this.settingsIdSource.asObservable();

  /**
   * Sets the settings ID.
   * @method setSettingsId
   * @param {string} settingsId - The settings ID to set.
   * @vscosousa - 09/11/2024
   */
  setSettingsId(settingsId: string) {
    this.settingsIdSource.next(settingsId);
  }

  /**
   * Requests account deletion based on the provided token.
   * @method deleteAccount
   * @param {string} token - The token to authenticate the deletion request.
   * @returns {Observable<HttpResponse<any>>} - The HTTP response observable.
   * @vscosousa - 12/11/2024
   */
  deleteAccount(token: string): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.apiUrl}/RequestDelete`, JSON.stringify(token), {
      headers: { 'Content-Type': 'application/json' },
      observe: 'response'
    });
  }
}
