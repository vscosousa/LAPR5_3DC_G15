/**
 * US 6.2.14 - As a Doctor, I want to request an operation, so that the Patient has access to the
necessary healthcare.
 * US Developed By: Tiago Sousa - 1150736
 * 
 * Finished at 23/11/2024
 * Component for requesting an  operation.
 * 
 * @component
 * @selector app-create-operation-request
 * @standalone true
 * @imports [CommonModule, ReactiveFormsModule, RouterModule, SidebarComponent]
 * 
 * @class CreateOperationRequestComponent
 * 
 * @property {object} operationType - The operation request data.
 * @property {number} operationRequest.patient - The patient's id.
 * @property {number} operationRequest.staff - The id from the doctor in charge.
 * @property {number} operationRequest.operationType- the type of  operation to be requested.
 * @property {Date} operationRequest.deadlineDate - The deadline date estipulated for the operation.

 * @method onSubmit Handles the form submission to create a new operation request.
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { OperationRequestService } from '../../../Services/operation-request.service';
import { PatientService } from '../../../Services/patient.service';
import { OperationTypeService } from '../../../Services/operation-type.service';
import { StaffService } from '../../../Services/staff-sevice.service';

@Component({
  selector: 'app-create-operation-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SidebarComponent],
  styleUrls: ['./create-operation-request.component.scss'],
  templateUrl: './create-operation-request.component.html',
  
})
export class CreateOperationRequestComponent implements OnInit {
  patients: { medicalRecordNumber: string; 
  fullName: string; }[] = [];
  operationRequestForm: FormGroup;
  operationTypes: any[] = [];
  doctors: any[] = [];
  staffProfiles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private operationRequestService: OperationRequestService,
    private router: Router,
    private patientService: PatientService,
    private operationTypeService: OperationTypeService,
    private staffService: StaffService
  ) {
    this.operationRequestForm = this.fb.group({
      deadlineDate: ['', Validators.required],
      priority: ['', Validators.required],
      patientMedicalRecordNumber: ['', Validators.required],
      doctorLicenseNumber: [''],
      operationType: ['', Validators.required]
    });
  }

  ngOnInit(): void{
    this.operationRequestForm = this.fb.group({
      deadlineDate: ['', Validators.required],
      priority: ['', Validators.required],
      patientMedicalRecordNumber: ['', Validators.required],
      doctorLicenseNumber: [''],
      operationType: ['', Validators.required]
    });
    this.fetchPatients();
    this.fetchOperationTypes();
    this.loadStaffProfiles();
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

  fetchOperationTypes(): void {
    this.operationTypeService.getOperationTypes().subscribe(
      (data: any[]) => {
        this.operationTypes = data;
        console.log('Operation types fetched:', data);
      },
      error => {
        console.error('Error fetching operation types', error);
      }
    );
  }
 

  loadStaffProfiles(): void {
    this.staffService.getAllStaffs().subscribe({
      next: (data) => {
        console.log("Data staff profiles:\n", data);
        this.staffProfiles = data;
        this.doctors = this.staffProfiles.filter(profile => profile.staffType === 'Doctor');
      },
      error: (error) => {
        console.error('Error loading staff profiles', error);
        this.staffProfiles = [];
        if (error.status === 401){
          alert('Unauthorized page access');
        } else {
          alert('Error loading staff profiles');
        }
      }
    });
  }


  onSubmit() {
    if (this.operationRequestForm.valid) {
      this.operationRequestService.createOperationRequest(this.operationRequestForm.value).subscribe(
        response => {
          alert('Operation requested successfully');
          this.router.navigate(['/operation-requests']);
        },
        error => {
          console.error('Error requesting operation', error);
          alert('There was an error requesting the operation. Please try again.');
        }
      );
    } else {
      alert('Please fill in all required fields.');
    }
  }
}