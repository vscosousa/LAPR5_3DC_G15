import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { PanelService } from '../../Services/panel.service';
import { SettingsService } from '../../Services/settings.service';
import { ProfileService } from '../../Services/profile.service';

/**
 * @class PatientSettingsComponent
 * @description TS file for the patient-settings component.
 * @vscosousa - 09/11/2024
 */
@Component({
  selector: 'app-patient-settings',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './patient-settings.component.html',
  styleUrl: './patient-settings.component.scss'
})
export class PatientSettingsComponent {
  /**
   * Service to handle panel-related operations.
   * @constructor
   * @param {Router} router
   * @param {PanelService} panelService
   * @param {SettingsService} settingsService
   * @vscosousa - 09/11/2024
   */
  constructor(
    private router: Router,
    private panelService: PanelService,
    private settingsService: SettingsService,
    private profileService: ProfileService
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * @method ngOnInit
   * @vscosousa - 09/11/2024
   */
  ngOnInit(): void {
    this.panelService.setPanelId('patient-panel');
    this.settingsService.setSettingsId('patient-settings');
    this.profileService.setProfileId('patient-profile');
  }

  /**
   * Handles the account deletion process.
   * @method onSubmit
   * @vscosousa - 09/11/2024
   */
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
