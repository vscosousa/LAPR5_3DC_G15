import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { PatientService } from '../../Services/patient.service';
import { Router, RouterModule } from '@angular/router';
import { PanelService } from '../../Services/panel.service';
import { AllergyService } from '../../Services/allergy.service';
import { MedicalConditionService } from '../../Services/medical-condition.service';
import { MedicalHistoryService } from '../../Services/medical-history.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-patient',
  standalone: true,
  imports: [FormsModule, SidebarComponent, RouterModule, CommonModule],
  templateUrl: './update-patient.component.html',
  styleUrls: ['./update-patient.component.scss']
})
export class UpdatePatientComponent implements OnInit {
  existingPatient = {
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    emergencyContact: '',
    allergies: [] as string[],
    medicalConditions: [] as string[]
  };

  allergies: { id: string; allergyName: string; }[] = [];
  medicalConditions: { id: string; medicalConditionName: string; }[] = [];

  showAllergiesModal = false;
  showMedicalConditionsModal = false;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private panelService: PanelService,
    private allergyService: AllergyService,
    private medicalConditionService: MedicalConditionService,
    private medicalHistoryService: MedicalHistoryService
  ) { }

  ngOnInit() {
    this.panelService.setPanelId('panel-admin');
    this.getPatient();
    this.fetchAllergies();
    this.fetchMedicalConditions();
  }

  getPatient() {
    const medicalRecordNumber = this.extractMedicalRecordNumberFromUrl();
    this.patientService.getPatientsWithAdvancedFilter(undefined, undefined, undefined, undefined, medicalRecordNumber).subscribe(
      patient => {
        this.existingPatient = patient[0];
        console.log('Patient fetched:', patient);
        this.fetchMedicalHistory(medicalRecordNumber); // Fetch medical history after fetching patient details
      },
      error => {
        console.error('Error fetching patient', error);
      }
    );
  }

  fetchMedicalHistory(medicalRecordNumber: string): void {
    this.medicalHistoryService.getPatientMedicalHistory(medicalRecordNumber).subscribe(
      (response: any) => {
        if (response) {
          this.existingPatient.allergies = response.allergies ? response.allergies.split(',') : [];
          this.existingPatient.medicalConditions = response.medicalConditions ? response.medicalConditions.split(',') : [];
          console.log('Medical history fetched:', response);
        } else {
          console.error('Failed to fetch medical history');
        }
      },
      error => {
        if (error.status === 404) {
          this.existingPatient.allergies = [];
          this.existingPatient.medicalConditions = [];
          console.error('Medical history not found (404)');
        } else {
          console.error('Error fetching medical history', error);
        }
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
    this.medicalHistoryService.updatePatientMedicalHistory(medicalRecordNumber, this.existingPatient.allergies, this.existingPatient.medicalConditions).subscribe(
      response => {
        console.log('Medical history updated successfully:', response);
      },
      error => {
        console.error('Error updating medical history:', error);
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

  fetchAllergies(): void {
    this.allergyService.getAllergies().subscribe(
      (response: any) => {
        if (response.isSuccess && response._value) {
          this.allergies = response._value;
          console.log('Allergies fetched:', this.allergies);
        } else {
          console.error('Failed to fetch allergies:', response.error);
        }
      },
      error => {
        console.error('Error fetching allergies', error);
      }
    );
  }

  fetchMedicalConditions(): void {
    this.medicalConditionService.getMedicalConditions().subscribe(
      (response: any) => {
        if (response.isSuccess && response._value) {
          this.medicalConditions = response._value;
          console.log('Medical Conditions fetched:', this.medicalConditions);
        } else {
          console.error('Failed to fetch medical conditions:', response.error);
        }
      },
      error => {
        console.error('Error fetching medical conditions', error);
      }
    );
  }

  onAllergyChange(event: any, allergyId: string) {
    if (event.target.checked) {
      this.existingPatient.allergies.push(allergyId);
    } else {
      const index = this.existingPatient.allergies.indexOf(allergyId);
      if (index > -1) {
        this.existingPatient.allergies.splice(index, 1);
      }
    }
  }

  onMedicalConditionChange(event: any, medicalConditionId: string) {
    if (event.target.checked) {
      this.existingPatient.medicalConditions.push(medicalConditionId);
    } else {
      const index = this.existingPatient.medicalConditions.indexOf(medicalConditionId);
      if (index > -1) {
        this.existingPatient.medicalConditions.splice(index, 1);
      }
    }
  }

  openAllergiesModal() {
    this.showAllergiesModal = true;
  }

  closeAllergiesModal() {
    this.showAllergiesModal = false;
  }

  openMedicalConditionsModal() {
    this.showMedicalConditionsModal = true;
  }

  closeMedicalConditionsModal() {
    this.showMedicalConditionsModal = false;
  }

  clearForm() {
    this.existingPatient = {
      firstName: '',
      lastName: '',
      fullName: '',
      email: '',
      phoneNumber: '',
      emergencyContact: '',
      allergies: [],
      medicalConditions: []
    };
  }

  isAllergySelected(allergyId: string): boolean {
    return this.existingPatient.allergies.includes(allergyId);
  }

  isMedicalConditionSelected(medicalConditionId: string): boolean {
    return this.existingPatient.medicalConditions.includes(medicalConditionId);
  }
}
