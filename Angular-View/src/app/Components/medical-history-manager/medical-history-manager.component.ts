import { MedicalHistoryService } from '../../Services/medical-history.service';
import { MedicalConditionService } from '../../Services/medical-condition.service';
import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { PatientService } from '../../Services/patient.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PanelService } from '../../Services/panel.service';
import { AllergyService } from '../../Services/allergy.service';

@Component({
  selector: 'app-medical-history-manager',
  standalone: true,
  imports: [SidebarComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './medical-history-manager.component.html',
  styleUrl: './medical-history-manager.component.scss'
})
export class MedicalHistoryManagerComponent {

  filters: any = {};
  patients: { medicalRecordNumber: string; fullName: string; }[] = [];
  selectedPatient: { medicalRecordNumber: string; fullName: string; dateOfBirth: string; email: string; emergencyContact: string; firstName: string; gender: number; id: string; isActive: boolean; lastName: string; medicalHistory: string; phoneNumber: string; appointmentHistory: any[] } | undefined;
  allergies: { id: string; allergyName: string; }[] = [];
  medicalConditions: { id: string; medicalConditionName: string; }[] = [];
  selectedAllergies: { id: string; allergyName: string; }[] = [];
  selectedMedicalConditions: { id: string; medicalConditionName: string; }[] = [];
  selectedMedicalHistory: { id: string, patientMedicalRecordNumber: string, medicalConditions: string[], allergies: string[], freeText: string, familyHistory: string[] } | undefined;
  allergySearch: string = '';
  medicalConditionSearch: string = '';
  filteredAllergies: { id: string; allergyName: string; }[] = [];
  filteredMedicalConditions: { id: string; medicalConditionName: string; }[] = [];
  isMedicalHistoryModalOpen: boolean = false;

  constructor(
    private patientService: PatientService,
    private panelService: PanelService,
    private allergyService: AllergyService,
    private medicalConditionService: MedicalConditionService,
    private medicalHistoryService: MedicalHistoryService
  ) { }

  ngOnInit(): void {
    this.panelService.setPanelId('panel-admin');
    this.clearFilters();
    this.fetchAllergies();
    this.fetchMedicalConditions();
  }

  fetchPatients(): void {
    this.patientService.getPatientsWithAdvancedFilter().subscribe(
      (data: any[]) => {
        this.patients = data;
        console.log('Patients fetched:', data);
      },
      error => {
        console.error('Error fetching patients', error);
      }
    );
  }

  fetchAllergies(): void {
    this.allergyService.getAllergies().subscribe(
      (response: any) => {
        if (response.isSuccess && response._value) {
          this.allergies = response._value;
          this.filteredAllergies = this.allergies;
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
          this.filteredMedicalConditions = this.medicalConditions;
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

  applyFilters(event: Event) {
    event.preventDefault();
    const filterString = Object.keys(this.filters)
      .map(key => `${key}=${this.filters[key]}`)
      .join('&');
    this.filterPatients(filterString);
  }

  filterPatients(filter: string): void {
    const filterParams: any = {};

    filter.split('&').forEach(param => {
      const [key, value] = param.split('=');
      if (value) {
        filterParams[key] = value;
      }
    });

    this.patientService.getPatientsWithAdvancedFilter(
      filterParams.firstName,
      filterParams.lastName,
      filterParams.fullName,
      filterParams.dateOfBirth,
      filterParams.medicalRecordNumber,
      filterParams.gender,
      filterParams.email,
      filterParams.phoneNumber
    ).subscribe(
      (data: any[]) => {
        if (data.length === 0) {
          this.patients = [];
        } else {
          this.patients = data;
        }
        console.log('Patients fetched:', data);
      },
      error => {
        this.patients = [];
        console.error('Error fetching patients', error);
      }
    );
  }

  clearFilters() {
    this.filters = {
      firstName: '',
      lastName: '',
      fullName: '',
      dateOfBirth: '',
      medicalRecordNumber: '',
      gender: '',
      email: '',
      phoneNumber: ''
    };

    this.fetchPatients();
  }

  deletePatient(medicalRecordNumber: string, patientName: string): void {
    const confirmation = window.confirm(`Are you sure you want to delete patient ${medicalRecordNumber} called ${patientName}?`);
    if (confirmation) {
      this.patientService.deletePatient(medicalRecordNumber).subscribe(
        () => {
          alert('Patient deleted successfully');
          this.refreshPatientList(medicalRecordNumber);
        },
        (error) => {
          console.error("Error deleting Patient:", error);
        }
      );
    }
  }

  viewPatientDetails(medicalRecordNumber: string): void {
    console.log(`Viewing details for patient ${medicalRecordNumber}`);
    this.patientService.getPatientsWithAdvancedFilter(undefined, undefined, undefined, undefined, medicalRecordNumber).subscribe(
      patient => {
        this.selectedPatient = patient[0];
        console.log('Patient fetched:', patient);
        this.fetchMedicalHistory(medicalRecordNumber);
      },
      error => {
        console.error('Error fetching patient', error);
      }
    );
  }

  fetchMedicalHistory(medicalRecordNumber: string): void {
    console.log('fetchMedicalHistory called with medicalRecordNumber:', medicalRecordNumber);
    this.medicalHistoryService.getPatientMedicalHistory(medicalRecordNumber).subscribe(
      (response: any) => {
        if (response) {
          this.selectedMedicalHistory = {
            id: response.id,
            patientMedicalRecordNumber: response.patientMedicalRecordNumber,
            medicalConditions: response.medicalConditions ? response.medicalConditions.split(',') : [],
            allergies: response.allergies ? response.allergies.split(',') : [],
            freeText: response.freeText,
            familyHistory: Array.isArray(response.familyHistory) ? response.familyHistory : this.parseFamilyHistoryString(response.familyHistory)
          };
          console.log('Medical history fetched:', this.selectedMedicalHistory);
          this.filterSelectedAllergies();
          this.filterSelectedMedicalConditions();
        } else {
          console.error('Failed to fetch medical history');
        }
      },
      error => {
        if (error.status === 404) {
          this.selectedMedicalHistory = undefined;
          this.selectedAllergies = [];
          this.selectedMedicalConditions = [];
          this.filteredAllergies = [];
          this.filteredMedicalConditions = [];
          console.error('Medical history not found (404)');
        } else {
          console.error('Error fetching medical history', error);
        }
      }
    );
  }
  
  parseFamilyHistoryString(familyHistoryString: string): string[] {
    return familyHistoryString
      .split(/,(?=\s*[A-Za-z]+:)/) // Split entries by comma followed by a relationship
      .map(entry => entry.trim()); // Trim each entry
  }
  

  parseFamilyHistory(familyHistory: string[]): { relationship: string; conditions: string[] }[] {
    return familyHistory.map(entry => {
      // Split the entry into relationship and conditions
      const [relationship, conditionsString] = entry.split(': ');
  
      if (!conditionsString) {
        return { relationship, conditions: [] };
      }
  
      // Split conditions by semicolons, handling commas inside condition names
      const conditions = conditionsString
        .split(';') // Split by semicolons
        .map(cond => cond.trim()) // Trim each condition
        .filter(cond => cond.length > 0); // Exclude empty conditions
  
      return {
        relationship: relationship.trim(),
        conditions,
      };
    });
  }

  filterSelectedAllergies(): void {
    if (this.selectedMedicalHistory) {
      this.selectedAllergies = this.allergies
        .filter(allergy => this.selectedMedicalHistory!.allergies.includes(allergy.id));
      this.filteredAllergies = this.selectedAllergies;
      console.log('Filtered allergies:', this.selectedAllergies);
    }
  }

  filterSelectedMedicalConditions(): void {
    if (this.selectedMedicalHistory) {
      this.selectedMedicalConditions = this.medicalConditions
        .filter(condition => this.selectedMedicalHistory!.medicalConditions.includes(condition.id));
      this.filteredMedicalConditions = this.selectedMedicalConditions;
      console.log('Filtered medical conditions:', this.selectedMedicalConditions);
    }
  }

  searchAllergies(): void {
    this.filteredAllergies = this.selectedAllergies.filter(allergy =>
      allergy.allergyName.toLowerCase().includes(this.allergySearch.toLowerCase())
    );
  }

  searchMedicalConditions(): void {
    this.filteredMedicalConditions = this.selectedMedicalConditions.filter(condition =>
      condition.medicalConditionName.toLowerCase().includes(this.medicalConditionSearch.toLowerCase())
    );
  }

  refreshPatientList(deletedMedicalRecordNumber: string): void {
    this.patients = this.patients.filter(patient => patient.medicalRecordNumber !== deletedMedicalRecordNumber);
  }

  openMedicalHistoryModal(): void {
    this.isMedicalHistoryModalOpen = true;
  }

  closeMedicalHistoryModal(): void {
    this.isMedicalHistoryModalOpen = false;
  }
}