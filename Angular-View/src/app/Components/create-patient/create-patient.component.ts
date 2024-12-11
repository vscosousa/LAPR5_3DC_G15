import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { PanelService } from '../../Services/panel.service';
import { PatientService } from '../../Services/patient.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

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
    familyHistory: { relationship: string; conditions: string[] }[];
    freeText: string;
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
    medicalConditions: [],
    familyHistory: [],
    freeText: ''
  };

  showMedicalHistoryModal = false;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private panelService: PanelService
  ) {}

  ngOnInit() {
    console.log('CreatePatientComponent initialized');
    this.panelService.setPanelId('panel-admin');
  }

  createPatient(event: Event) {
    event.preventDefault();
    this.patientService.createPatient(this.newPatient).subscribe(
      (response: any) => {
        console.log('Patient created:', response);
        this.clearForm();
        alert('Patient created successfully');
        this.router.navigate(['/patients']);
      },
      (error: any) => {
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
      allergies: [],
      medicalConditions: [],
      familyHistory: [],
      freeText: ''
    };
  }
}
