import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { PatientService } from '../../Services/patient.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/**
 * @class ManagePatientsComponent
 * @description TS file for the manage-patients component.
 * @vscosousa - 12/11/2024
 */
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

  /**
   * Service to handle patient-related operations.
   * @constructor
   * @param {PatientService} patientService
   * @vscosousa - 12/11/2024
   */
  constructor(private patientService: PatientService) { }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * @method ngOnInit
   * @vscosousa - 12/11/2024
   */
  ngOnInit(): void {
    this.fetchOperationTypes();
  }

  /**
   * Fetches the list of patients with advanced filters.
   * @method fetchOperationTypes
   * @vscosousa - 12/11/2024
   */
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

  /**
   * Applies the filters to fetch the filtered list of patients.
   * @method applyFilters
   * @param {Event} event - The form submission event.
   * @vscosousa - 12/11/2024
   */
  applyFilters(event: Event) {
    event.preventDefault();
    const filterString = Object.keys(this.filters)
      .map(key => `${key}=${this.filters[key]}`)
      .join('&');
    this.filterPatients(filterString);
  }

  /**
   * Filters the patients based on the provided filter string.
   * @method filterPatients
   * @param {string} filter - The filter string.
   * @vscosousa - 12/11/2024
   */
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

  /**
   * Clears the applied filters and fetches the full list of patients.
   * @method clearFilters
   * @vscosousa - 12/11/2024
   */
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

  /**
   * Deletes a patient based on the provided medical record number.
   * @method deletePatient
   * @param {string} medicalRecordNumber - The medical record number of the patient to be deleted.
   * @param {string} patientName - The name of the patient to be deleted.
   * @vscosousa - 12/11/2024
   */
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

  /**
   * Views the details of a patient based on the provided medical record number.
   * @method viewPatientDetails
   * @param {string} medicalRecordNumber - The medical record number of the patient to be viewed.
   * @vscosousa - 12/11/2024
   */
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

  /**
   * Refreshes the patient list after a patient is deleted.
   * @method refreshPatientList
   * @param {string} deletedMedicalRecordNumber - The medical record number of the deleted patient.
   * @vscosousa - 12/11/2024
   */
  refreshPatientList(deletedMedicalRecordNumber: string): void {
    this.patients = this.patients.filter(patient => patient.medicalRecordNumber !== deletedMedicalRecordNumber);
  }
}
