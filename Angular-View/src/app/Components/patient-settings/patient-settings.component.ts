import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { DashboardService } from '../../Services/dashboard.service';
import { SettingsService } from '../../Services/settings.service';

@Component({
  selector: 'app-patient-settings',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './patient-settings.component.html',
  styleUrl: './patient-settings.component.scss'
})
export class PatientSettingsComponent {
  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.dashboardService.setDashboardId('patient-dashboard');
    this.settingsService.setSettingsId('patient-settings');
  }

  onSubmit() {
    const token: string = localStorage.getItem('token') as string;
    if (token) {
      this.settingsService.deleteAccount(token).subscribe(
      response => {
        console.log('Request Finished With Success', response);
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
        alert('To complete the account deletion process, please check your email for further instructions.');
      },
      error => {
        console.error('Account deletion failed', error);
        alert('Account deletion failed - ' + error.error);
      }
      );
    } else {
      this.router.navigate(['/login']);
      alert('No token found. Please log in again.');
    }
  }
}
