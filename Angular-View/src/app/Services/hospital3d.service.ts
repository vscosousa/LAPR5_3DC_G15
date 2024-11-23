import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Hospital3dService {

  private readonly apiUrl = 'https://localhost:5001/api/SurgeryRoom/'; // Replace with your actual API endpoint

constructor(private http: HttpClient) {}

/**
 * Calls the backend API to get surgery room availability for a specific date.
 * @param date The date to check availability for.
 * @returns Observable containing the list of available surgery rooms.
 */
getRoomsAvailabilityByDate(date: any): Observable<any[]> {
  const dateObj = new Date(date);
  const formattedDate = dateObj.toISOString().split('T')[0];
  console.log(formattedDate);
  const params = new HttpParams().set('date', formattedDate);
  return this.http.get<any[]>(this.apiUrl, { params });
}

}
