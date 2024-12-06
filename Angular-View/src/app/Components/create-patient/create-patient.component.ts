import { PanelService } from './../../Services/panel.service';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { PatientService } from '../../Services/patient.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AllergyService } from '../../Services/allergy.service';
import { MedicalConditionService } from '../../Services/medical-condition.service';

@Component({
  selector: 'app-create-patient',
  standalone: true,
  imports: [FormsModule, SidebarComponent, RouterModule, CommonModule],
  templateUrl: './create-patient.component.html',
  styleUrl: './create-patient.component.scss'
})
export class CreatePatientComponent implements OnInit {
  newPatient: {
    firstName: string;
    lastName: string;
    fullName: string;
    dateOfBirth: string;
    genderOptions: string;
    email: string;
    phoneNumber: string;
    emergencyContact: string;
    allergies: string[];
    medicalConditions: string[];
  } = {
    firstName: '',
    lastName: '',
    fullName: '',
    dateOfBirth: '',
    genderOptions: '',
    email: '',
    phoneNumber: '',
    emergencyContact: '',
    allergies: [],
    medicalConditions: []
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
    private medicalConditionService: MedicalConditionService
  ) {}

  ngOnInit() {
    console.log('CreatePatientComponent initialized');
    this.fetchAllergies();
    this.fetchMedicalConditions();
    this.panelService.setPanelId('panel-admin');
  }

  createPatient(event: Event) {
    event.preventDefault();
    this.patientService.createPatient(this.newPatient).subscribe(
      (response: any) => {
        console.log('Patient created:', response);
        this.clearForm();
        alert('Patient created successfully');
        this.router.navigate(['/manage-patients']);
      },
      error => {
        console.error('Error creating patient', error);
        alert('Error creating patient');
      }
    );
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
      this.newPatient.allergies.push(allergyId);
    } else {
      const index = this.newPatient.allergies.indexOf(allergyId);
      if (index > -1) {
        this.newPatient.allergies.splice(index, 1);
      }
    }
  }

  onMedicalConditionChange(event: any, medicalConditionId: string) {
    if (event.target.checked) {
      this.newPatient.medicalConditions.push(medicalConditionId);
    } else {
      const index = this.newPatient.medicalConditions.indexOf(medicalConditionId);
      if (index > -1) {
        this.newPatient.medicalConditions.splice(index, 1);
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
    this.newPatient = {
      firstName: '',
      lastName: '',
      fullName: '',
      dateOfBirth: '',
      genderOptions: '',
      email: '',
      phoneNumber: '',
      emergencyContact: '',
      allergies: [],
      medicalConditions: []
    };
  }
}
