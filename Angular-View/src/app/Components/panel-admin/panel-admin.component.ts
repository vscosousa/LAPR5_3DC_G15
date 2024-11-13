import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { SettingsService } from '../../Services/settings.service';
import { PanelService } from '../../Services/panel.service';

/**
 * @class PanelAdminComponent
 * @description TS file for the panel-admin component.
 * @joaohcpereiraa - 12/11/2024
 */
@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [SidebarComponent, RouterModule],
  templateUrl: './panel-admin.component.html',
  styleUrl: './panel-admin.component.scss'
})
export class PanelAdminComponent {

  /**
   * Service to handle panel-related operations.
   * @constructor
   * @param {PanelService} panelService
   * @param {SettingsService} settingsService
   * @joaohcpereiraa - 12/11/2024
   */
  constructor(private panelService: PanelService, private settingsService: SettingsService) {}

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * @method ngOnInit
   * @joaohcpereiraa - 12/11/2024
   */
  ngOnInit(): void {
    this.panelService.setPanelId('panel-admin');
  }

}
