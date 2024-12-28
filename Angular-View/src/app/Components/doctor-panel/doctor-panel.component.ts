import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { PanelService } from '../../Services/panel.service';

@Component({
  selector: 'app-doctor-panel',
  standalone: true,
  imports: [SidebarComponent, RouterModule],
  templateUrl: './doctor-panel.component.html',
  styleUrl: './doctor-panel.component.scss'
})
export class DoctorPanelComponent {

  constructor(
    private panelService: PanelService
  ) { }

  ngOnInit() {
    this.panelService.setPanelId('panel-doctor');
  }

}
