import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor() { }

  private dashboardIdSource = new BehaviorSubject<string>('default-dashboard');
  dashboardId$ = this.dashboardIdSource.asObservable();

  setDashboardId(dashboardId: string) {
    this.dashboardIdSource.next(dashboardId);
  }
}