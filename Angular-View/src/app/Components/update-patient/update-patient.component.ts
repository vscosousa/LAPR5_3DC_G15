import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { PatientService } from '../../Services/patient.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-update-patient',
  standalone: true,
  imports: [FormsModule, SidebarComponent, RouterModule],
  templateUrl: './update-patient.component.html',
  styleUrls: ['./update-patient.component.scss']
})
export class UpdatePatientComponent {
  existingPatient = {
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    emergencyContact: '',
    medicalConditions: ''
  };

  constructor(private patientService: PatientService, private router: Router) { }

  ngOnInit() {
    this.getPatient();
  }

  getPatient() {
    const medicalRecordNumber = this.extractMedicalRecordNumberFromUrl();
    this.patientService.getPatientsWithAdvancedFilter(undefined, undefined, undefined, undefined, medicalRecordNumber).subscribe(
      patient => {
        this.existingPatient = patient[0];
        console.log('Patient fetched:', patient);
      },
      error => {
        console.error('Error fetching patient', error);
      }
    );
  }

  updatePatientDetails(event: Event) {
    event.preventDefault();
    const medicalRecordNumber = this.extractMedicalRecordNumberFromUrl();
    this.patientService.updatePatient(medicalRecordNumber, this.existingPatient).subscribe(
      response => {
        console.log('Patient updated successfully:', response);
        alert("Patient updated successfully!");
        this.router.navigate(['/manage-patients']);
      },
      error => {
        console.error('Error updating patient:', error);
        alert("Error updating patient" + error);
      }
    );
  }

  extractMedicalRecordNumberFromUrl() {
    const url = window.location.href;
    const regex = /\/update-patient\/(\d+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1];
    } else {
      throw new Error('Medical record number not found in URL.');
    }
  }

  clearForm() {
    this.existingPatient = {
      firstName: '',
      lastName: '',
      fullName: '',
      email: '',
      phoneNumber: '',
      emergencyContact: '',
      medicalConditions: ''
    };
  }
}
