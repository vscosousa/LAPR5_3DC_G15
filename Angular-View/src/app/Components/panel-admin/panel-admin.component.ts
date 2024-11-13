import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { SettingsService } from '../../Services/settings.service';
import { PanelService } from '../../Services/panel.service';

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [SidebarComponent, RouterModule],
  templateUrl: './panel-admin.component.html',
  styleUrl: './panel-admin.component.scss'
})
export class PanelAdminComponent {

  constructor(private panelService: PanelService, private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.panelService.setPanelId('panel-admin');
  }

}
