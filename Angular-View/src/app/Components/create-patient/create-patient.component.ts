import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { PatientService } from '../../Services/patient.service';

/**
 * @class CreatePatientComponent
 * @description TS file for the create-patient component.
 * @implements OnInit
 * @vscosousa - 12/11/2024
 */
@Component({
  selector: 'app-create-patient',
  standalone: true,
  imports: [FormsModule, SidebarComponent],
  templateUrl: './create-patient.component.html',
  styleUrl: './create-patient.component.scss'
})
export class CreatePatientComponent {
  /**
   * Object to hold the new patient details.
   * @property {Object} newPatient
   * @vscosousa - 12/11/2024
   */
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

  /**
   * Service to handle patient-related operations.
   * @constructor
   * @param {PatientService} patientService
   * @vscosousa - 12/11/2024
   */
  constructor(private patientService: PatientService) {}

  /**
   * Handles the form submission to create a new patient.
   * @method createPatient
   * @param {Event} event - The form submission event.
   * @vscosousa - 12/11/2024
   */
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

  /**
   * Clears the form fields.
   * @method clearForm
   * @vscosousa - 12/11/2024
   */
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
