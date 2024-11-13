import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { PatientService } from '../../Services/patient.service';

@Component({
  selector: 'app-create-patient',
  standalone: true,
  imports: [FormsModule, SidebarComponent],
  templateUrl: './create-patient.component.html',
  styleUrl: './create-patient.component.scss'
})
export class CreatePatientComponent {
  newPatient = {
    firstName: '',
    lastName: '',
    fullName: '',
    dateOfBirth: '',
    genderOptions: '',
    email: '',
    phoneNumber: '',
    emergencyContact: '',
    medicalConditions: ''
  };

  constructor(private patientService: PatientService) {}

  createPatient(event: Event) {
    event.preventDefault();
    this.patientService.createPatient(this.newPatient).subscribe(
      (response: any) => {
        console.log('Patient created:', response);
        this.clearForm();
        alert('Patient created successfully');
      },
      error => {
        console.error('Error creating patient', error);
        alert('Error creating patient');
      }
    );
  }

  clearForm() {
    this.newPatient = {
      firstName: '',
      lastName: '',
      fullName: '',
      dateOfBirth: '',
      genderOptions: '',
      email: '',
      phoneNumber: '',
      emergencyContact: '',
      medicalConditions: ''
    };
  }
}
