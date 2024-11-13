import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { SettingsService } from '../../Services/settings.service';
import { PanelService } from '../../Services/panel.service';

@Component({
  selector: 'app-patient-panel',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './patient-panel.component.html',
  styleUrl: './patient-panel.component.scss'
})
export class PatientPanelComponent {

  constructor(private router: Router, private panelService: PanelService, private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.panelService.setPanelId('patient-panel');
    this.settingsService.setSettingsId('patient-settings');
  }
}
