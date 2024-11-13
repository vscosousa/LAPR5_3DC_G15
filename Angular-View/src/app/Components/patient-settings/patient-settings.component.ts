import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { PanelService } from '../../Services/panel.service';
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
    private panelService: PanelService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.panelService.setPanelId('patient-panel');
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
