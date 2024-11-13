import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { PatientService } from '../../Services/patient.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-manage-patients',
  standalone: true,
  imports: [SidebarComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './manage-patients.component.html',
  styleUrl: './manage-patients.component.scss'
})
export class ManagePatientsComponent {

  filters: any = {};
  patients: { medicalRecordNumber: string; fullName: string; }[] = [];
  selectedPatient: { medicalRecordNumber: string; fullName: string; dateOfBirth: string; email: string; emergencyContact: string; firstName: string; gender: number; id: string; isActive: boolean; lastName: string; medicalConditions: string; phoneNumber: string; appointmentHistory: any[] } | undefined;

  constructor(private patientService: PatientService) { }


  ngOnInit(): void {
    this.fetchOperationTypes();
  }

  fetchOperationTypes(): void {
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

    this.fetchOperationTypes();
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
      },
      error => {
        console.error('Error fetching patient', error);
      }
    );
  }

  refreshPatientList(deletedMedicalRecordNumber: string): void {
    this.patients = this.patients.filter(patient => patient.medicalRecordNumber !== deletedMedicalRecordNumber);
  }
}
