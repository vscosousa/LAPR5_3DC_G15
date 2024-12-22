import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../../Services/settings.service';
import { PanelService } from '../../Services/panel.service';
import { ProfileService } from '../../Services/profile.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

/**
 * @class PatientPanelComponent
 * @description TS file for the patient-panel component.
 * @vscosousa - 09/11/2024
 */
@Component({
  selector: 'app-patient-panel',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './patient-panel.component.html',
  styleUrl: './patient-panel.component.scss'
})
export class PatientPanelComponent {

  /**
   * Service to handle panel-related operations.
   * @constructor
   * @param {Router} router
   * @param {PanelService} panelService
   * @param {SettingsService} settingsService
   * @vscosousa - 09/11/2024
   */
  constructor(private router: Router, private panelService: PanelService, private settingsService: SettingsService, private profileService: ProfileService) { }

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
}
