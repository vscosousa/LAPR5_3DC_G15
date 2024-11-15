import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class StaffService {
  private apiUrl = 'https://localhost:5001/api/staff'; 
  private apiURLSpecializaction = 'https://localhost:5001/api/specialization';

  constructor(private http: HttpClient) { }

  createStaff(firstName: string, lastName: string, fullName: string, email: string, identifier: string, phoneNumber: string, staffType: string, specializationName: string): Observable<HttpResponse<string>> {
    const CreateStaff = {
      firstName,
      lastName,
      fullName,
      email,
      phoneNumber: identifier + phoneNumber,
      staffType,
      specializationName
    }

    console.log(CreateStaff);

    return this.http.post<string>(`${this.apiUrl}`, CreateStaff, {
      observe: 'response',
      responseType: 'text' as 'json'
    });
    
  }

  getSpecialization(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURLSpecializaction}`);
  }

  getStaffTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/staff-types`);
  }

  searchStaffProfiles(criteria: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search`, { 
      params: criteria 
    });
  }

  deactivateStaff(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/deactivate/${id}`, {});
  }

  updateStaff(id: string, updateData: any): Observable<any> {
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
}