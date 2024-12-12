import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class StaffService {
  private apiUrl = 'https://localhost:5001/api/staff'; 
  private apiURLSpecializaction = 'https://localhost:5001/api/specialization';
  private apiURLUser='https://localhost:5001/api/user';

  constructor(private http: HttpClient) { }

  createStaff(newStaff:{firstName: string, lastName: string, fullName: string, email: string, phoneNumber: string, staffType: string, specializationName: string}): Observable<HttpResponse<string>> {
    return this.http.post<any>(`${this.apiUrl}`, newStaff, {
      observe: 'response',
      responseType: 'text' as 'json'
    });
  }

  getSpecialization(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURLSpecializaction}`);
  }

  getStaffTypes(): Observable<string[]> {
    return this.http.get<any[]>(`${this.apiUrl}/staff-types`);
  }

  searchStaffProfiles(criteria: {firstName:string, lastName:string, fullName:string, email:string,specializationName:string}): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search`, { 
      params: criteria 
    });
  }

  deactivateStaff(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/deactivate/${id}`, {});
  }

  updateStaff(id: string, updateData: {phoneNumber:string, email:string, addAvailabilitySlots:string, removeAvailabilitySlots: string, specializationName: string}): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updateData);
  }

  getStaffById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getAllStaffs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  confirmUpdates(updateData: any): Observable<any> {
    let params = new HttpParams();
    if (updateData.phoneNumber) params = params.append('phoneNumber', updateData.phoneNumber);
    if (updateData.email) params = params.append('email', updateData.email);
    params = params.append('token', updateData.token);

    return this.http.put<any>(`${this.apiUrl}/ConfirmUpdates`, {}, { params });
  }

  activateStaff(userInfo: {email:string, username:string, role: string, staffId: string}): Observable<HttpResponse<any>> {
    const url = `${this.apiURLUser}/RegisterUser`;
    return this.http.post<HttpResponse<any>>(url, userInfo);
  }

  activateUser(token: string, newPassword: string): Observable<any> {
    const params = { token, newPassword };
    return this.http.post<any>(`${this.apiURLUser}/Activate`, null, { params });
  }
}