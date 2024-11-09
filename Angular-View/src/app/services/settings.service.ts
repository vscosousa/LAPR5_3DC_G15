import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = 'https://localhost:5001/api/user';

  constructor(private http: HttpClient) { }

  private settingsIdSource = new BehaviorSubject<string>('default-settings');
  settingsId$ = this.settingsIdSource.asObservable();

  setSettingsId(settingsId: string) {
    this.settingsIdSource.next(settingsId);
  }

  deleteAccount(token: string): Observable<HttpResponse<string>> {
    return this.http.delete<string>(`${this.apiUrl}/RequestDelete/${token}`, {
      observe: 'response',
      responseType: 'text' as 'json'
    });
  }
}
