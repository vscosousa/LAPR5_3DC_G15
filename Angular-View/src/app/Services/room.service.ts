import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'http://localhost:4000/api/rooms';
  constructor(private http: HttpClient) { }

  getRooms(): Observable<any[]> {
    console.log('getRooms called');
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      catchError(error => {
        console.error('Error fetching rooms:', error);
        return of([]);
      })
    );
  }

  createRoom(room: { name: string, type: string, description: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, { name: room.name, type: room.type, description: room.description })
      .pipe(
        catchError(error => {
          console.error('Error creating room:', error);
          return throwError(() => new Error('Failed to create room. Please try again later.'));
        })
      );
  }

  updateRoom(id: string, room: { name: string, type: string, description: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, {
      name: room.name,
      type: room.type,
      description: room.description
    }).pipe(
      catchError(error => {
        console.error('Error updating room:', error);
        return throwError(() => new Error('Failed to update room. Please try again later.'));
      })
    );
  }
}