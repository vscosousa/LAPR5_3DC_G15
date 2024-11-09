import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { DashboardService } from '../../Services/dashboard.service';
import { SettingsService } from '../../Services/settings.service';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.scss'
})
export class PatientDashboardComponent {

  constructor(private router: Router, private dashboardService: DashboardService, private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.dashboardService.setDashboardId('patient-dashboard');
    this.settingsService.setSettingsId('patient-settings');
  }
}
