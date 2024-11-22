import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-doctor-panel',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './doctor-panel.component.html',
  styleUrl: './doctor-panel.component.scss'
})
export class DoctorPanelComponent {

}
