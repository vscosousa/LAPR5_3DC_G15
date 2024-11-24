/**
 * US 6.2.15 - As a Doctor, I want to update an operation requisition, so that the Patient has
 * access to the necessary healthcare.
 * US Developed By: Tiago Sousa - 1150736`
 * 
 * Finished at [24/11/2024]
 * Component for updating an operation requisition.
 */

import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { OperationRequestService } from '../../../Services/operation-request.service';
import { PanelService } from '../../../Services/panel.service';
import { PatientService } from '../../../Services/patient.service';
import { OperationTypeService } from '../../../Services/operation-type.service';
import { StaffService } from '../../../Services/staff-sevice.service';
/**
@Component({
  selector: 'app-update-operation-request',
  standalone: true,
  imports: [FormsModule, SidebarComponent, RouterModule],
  styleUrls: ['./update-operation-request.component.scss'],
  templateUrl: './update-operation-request.component.html',
})
export class UpdateOperationRequestComponent implements OnInit {
  existingOperationRequest = {
    id: '', 
    patientMedicalRecordNumber: '', 
    patientFullName: '', 
    doctorLicenseNumber: '', 
    operationType: '', 
    priority: '',
    deadlineDate: ''
  };


  constructor(
    private operationRequestService: OperationRequestService,
    private router: Router,
    private panelService: PanelService
  ) {}

  ngOnInit() {
    this.panelService.setPanelId('panel-admin');
    this.getOperationRequest(); 
  }

  getOperationRequest() {
    const operationRequest = this.extractOperationRequestFromUrl();
    this.operationRequestService.getOperationRequests().subscribe(
      operationRequest => {
        this.existingOperationRequest = operationRequest[0];
        console.log('Patient fetched:', operationRequest);
      },
      error => {
        console.error('Error fetching patient', error);
      }
    );
  }

  updateOperationRequest(event: Event) {
    event.preventDefault();
    const operationRequest = this.extractOperationRequestFromUrl();
    this.operationRequestService.updateOperationRequest(operationRequest, this.existingOperationRequest).subscribe(
      response => {
        console.log('Operation request updated successfully:', response);
        alert("Operation request updated successfully!");
        this.router.navigate(['/manage-patients']);
      },
      error => {
        console.error('Error updating operation request:', error);
        alert("Error updating operation request" + error);
      }
    );
  } 

  extractOperationRequestFromUrl() {
    const url = window.location.href;
    const regex = /\/update-operationRequest\/(\d+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1];
    } else {
      throw new Error('Operation Request not found in URL.');
    }
  }

  clearForm() {
    this.existingOperationRequest = {
      id: '', 
    patientMedicalRecordNumber: '', 
    patientFullName: '', 
    doctorLicenseNumber: '',
    operationType: '', 
    priority: '', 
    deadlineDate: '',
    };
  }
    
}
*/