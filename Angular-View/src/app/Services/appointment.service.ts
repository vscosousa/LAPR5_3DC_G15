/**
 * @class AppointmentService
 * @description Service to handle appointment-related API requests.
 * 
 * @author Vasco Sousa (1221700)
 * @date 11/12/2024
 * 
 * @method createAppointment
 * @description Creates a new appointment.
 * @returns {Observable<any>} An observable containing the created appointment.
 * 
 * @method getAppointments
 * @description Fetches all appointments from the API.
 * @returns {Observable<any[]>} An observable containing an array of appointments.
 * 
 * @method getAppointmentById
 * @description Fetches a specific appointment by ID.
 * @returns {Observable<any>} An observable containing the fetched appointment.
 * 
 * @method updateAppointment
 * @description Updates an existing appointment.
 * @returns {Observable<any>} An observable containing the updated appointment.
 */


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiUrl = 'http://localhost:4000/api/appointments';
  constructor(private http: HttpClient) { }

  createAppointment(newAppointment: { requestId: string; roomId: string; dateTime: string; status: string; team: string[]; }) {
    console.log('Creating appointment:', newAppointment);
    return this.http.post<any>(`${this.apiUrl}/create`, newAppointment)
      .pipe(
        catchError(error => {
          console.error('Error creating appointment:', error);
          return throwError(() => new Error('Failed to create appointment. Please try again later.'));
        })
      );
  }

  getAppointments() {
    console.log('getAppointments called');
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      catchError(error => {
        console.error('Error fetching appointments:', error);
        return throwError(() => new Error('Failed to fetch appointments. Please try again later.'));
      })
    );
  }

  getAppointmentById(appointmentId: string) {
    console.log('getAppointmentById called');
    return this.http.get<any>(`${this.apiUrl}/${appointmentId}`).pipe(
      catchError(error => {
        console.error('Error fetching appointment:', error);
        return throwError(() => new Error('Failed to fetch appointment. Please try again later.'));
      })
    );
  }

  updateAppointment(id: string, existingAppointment: { roomId: string; dateTime: string; team: string[]; }) {
    console.log('Updating appointment:', existingAppointment);
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, existingAppointment).pipe(
      catchError(error => {
        console.error('Error updating appointment:', error);
        return throwError(() => new Error('Failed to update appointment. Please try again later.'));
      })
    );
  }
}
