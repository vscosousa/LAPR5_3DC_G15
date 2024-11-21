import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Hospital3dService {

  private readonly apiUrl = 'https://localhost:5001/api/SurgeryRooms/'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  getRoomsAvailabilityByDate(date: Date): Observable<any[]> {
    const formattedDate = date.toISOString();
    return this.http.get<any[]>(`${this.apiUrl}${formattedDate}`);
  }
}
