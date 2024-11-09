import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperationTypeService {

  private apiUrl = 'https://localhost:5001/api/OperationType';


  constructor(private http: HttpClient) { }

  getOperationTypes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
