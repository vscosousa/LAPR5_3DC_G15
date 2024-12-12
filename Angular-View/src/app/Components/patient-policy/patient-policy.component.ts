import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-patient-policy',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './patient-policy.component.html',
  styleUrl: './patient-policy.component.scss'
})
export class PatientPolicyComponent {
}
