import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-doctor-panel',
  standalone: true,
  imports: [SidebarComponent, RouterModule],
  templateUrl: './doctor-panel.component.html',
  styleUrl: './doctor-panel.component.scss'
})
export class DoctorPanelComponent {

}
