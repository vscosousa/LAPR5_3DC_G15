import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PanelService } from '../../Services/panel.service';
import { SettingsService } from '../../Services/settings.service';
import { jwtDecode } from 'jwt-decode';
import { ProfileService } from '../../Services/profile.service';

/**
 * @class SidebarComponent
 * @description TS file for the sidebar component.
 * @vscosousa - 12/11/2024
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  panelId: string = '';
  settingsId: string = '';
  profileId: string = '';
  name: string = '';
  role: string = '';
  privacyId: string = '';

  /**
   * Service to handle panel-related operations.
   * @constructor
   * @param {PanelService} panelService
   * @param {SettingsService} settingsService
   * @vscosousa - 12/11/2024
   */
  constructor(private panelService: PanelService, private settingsService: SettingsService, private profileService: ProfileService) { }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * @method ngOnInit
   * @vscosousa - 12/11/2024
   */
  ngOnInit(): void {
    this.panelService.panelId$.subscribe(panelId => {
      this.panelId = panelId;
    });

    this.settingsService.settingsId$.subscribe(settingsId => {
      this.settingsId = settingsId;
    });

    this.profileService.profileId$.subscribe(profileId => {
      this.profileId = profileId;
    });

    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token:', token);
      const decodedToken: any = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);
      this.name = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
      this.role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      console.log('Name:', this.name);
      console.log('Role:', this.role);
    }
  }

  /**
   * Handles the logout process by removing the token from local storage.
   * @method logout
   * @joaohcpereiraa - 08/11/2024
   */
  logout() {
    localStorage.removeItem('token');
  }
}
