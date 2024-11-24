/**
 * US 6.2.16 - As a Doctor, I want to remove an operation requisition, so that the healthcare
activities are provided as necessary.

 * US 6.2.17 - As a Doctor, I want to list/search operation requisitions, so that I see the details,
edit, and remove operation requisitions.

 * 
 * US Developed By: Tiago Sousa - 1150736 
 * Finished at 24/11/2024
 *
 * Component for managing operation requests and their associated staff members.
 * 
 * @component
 * @selector app-operation-requests
 * @standalone true
 * @imports [CommonModule, RouterModule, SidebarComponent]

 * @class OperationRequesComponent
 * @implements OnInit
 * 
 * @method ngOnInit Initializes the component and fetches operation Requests.
 * @method fetchOperationRequests Fetches all operation requests from the service.
 * @method fetchOperationTypes Fetches all operation types from the service.
 * @method onEdit Handles editing an operation Request.
 * @method deleteOperationRequest Deletes an operation Request.
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule to access ngFor
import { RouterModule } from '@angular/router';
import { OperationRequestService } from '../../Services/operation-request.service';
import { OperationTypeService } from '../../Services/operation-type.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import {PanelService } from '../../Services/panel.service';
import { PatientService } from '../../Services/patient.service'; 
import { FormsModule } from '@angular/forms';

// Define the Patient type inline
type Patient = {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    dateOfBirth: string;
    genderOptions: string; // You can specify this further if needed
    email: string;
    phoneNumber: string;
    emergencyContact: string;
    medicalConditions: string;
};

@Component({
  selector: 'app-operation-requests',
  standalone: true,  // Ensuring this is a standalone component
  imports: [CommonModule, RouterModule, SidebarComponent, FormsModule],
  templateUrl: './operation-requests.component.html',
  styleUrls: ['./operation-requests.component.scss']
})
export class OperationRequestsComponent implements OnInit {
  operationRequests: any[] = [];
  operationTypes: any[] = [];
  selectedOperationRequest: any;
  searchTerm: string = '';
  patients: Patient[] = [];
  filters: any = {};


  constructor(private operationRequestsService: OperationTypeService, private panelService:PanelService, private operationRequestService: OperationRequestService) { }
  ngOnInit(): void {
    this.fetchOperationRequests();
    this.panelService.setPanelId("panel-admin")
  }

   // Fetch all operation requests
   fetchOperationRequests(): void {
    this.operationRequestService.getOperationRequests().subscribe(
      (data: any[]) => {
        this.operationRequests = data;
        console.log('Operation requests fetched:', data);
      },
      error => {
        console.error('Error fetching operation requests', error);
      }
    );
  }

  // Delete an operation Request
  deleteOperationRequest(operationRequest: string, doctorLicenseNumber: string): void {
    const confirmation = window.confirm(`Are you sure you want to delete the operation request: ${operationRequest}?`);
    if (confirmation) {
      this.operationRequestService.deleteOperationRequest(operationRequest, doctorLicenseNumber).subscribe(
        () => {
          alert('Operation request deleted successfully');
        },
        error => {
          console.error("Error deleting operation Request:", error);
        }
      );
    }
  }

  viewOperationRequestDetails(selectedOperationRequest: string): void {
    console.log(`Viewing details for operationRequest ${selectedOperationRequest}`);
    this.operationRequestService.getOperationRequestsWithAdvancedFilter().subscribe(
      operationRequest => {
        this.selectedOperationRequest = selectedOperationRequest[0];
        console.log('Operation request fetched:', operationRequest);
      },
      error => {
        console.error('Error fetching operation request', error);
      }
    );
  }
  applyFilters(event: Event) {
    event.preventDefault();
    const filterString = Object.keys(this.filters)
      .map(key => `${key}=${this.filters[key]}`)
      .join('&');
    this.filterOperationRequests(filterString);
  }

  /**
   * Refreshes the operation request list after a patient is deleted.
   */
  refreshOperationRequestList(deletedOperationRequest: string): void {
    this.operationRequests = this.operationRequests.filter(operationRequest => operationRequest.id !== deletedOperationRequest);
  }

  /**
   * Clears the applied filters and fetches the full list of operation requests.
   * @method clearFilters
   * @vscosousa - 12/11/2024
   */
  clearFilters() {
    this.filters = {
      operationRequest: '',
      OperationType: '',
      doctorLicenseNumber: '',
      patientMedicalRecordNumber: '',
      deadlineDate: '',
      priority: '',
    };

    this.fetchOperationRequests();
  }

/**
   * Filters the operation request based on the provided filter string.
   */
filterOperationRequests(filter: string): void {
  const filterParams: any = {};

  filter.split('&').forEach(param => {
    const [key, value] = param.split('=');
    if (value) {
      filterParams[key] = value;
    }
  });

  this.operationRequestService.getOperationRequestsWithAdvancedFilter(
    filterParams.operationRequest,
    filterParams.OperationType,
    filterParams.doctorLicenseNumber,
    filterParams.patientMedicalRecordNumber,
    filterParams.deadlineDate,
    filterParams.priority
  ).subscribe(
    (data: any[]) => {
      if (data.length === 0) {
        this.operationRequests = [];
      } else {
        this.operationRequests = data;
      }
      console.log('Patients fetched:', data);
    },
    error => {
      this.patients = [];
      console.error('Error fetching patients', error);
    }
  );
}

  // Search operation requests
  searchOperationRequests(): void {
    if (this.searchTerm) {
      this.operationRequests = this.operationRequests.filter(request =>
        request.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.fetchOperationRequests(); // Reset to original list if search term is empty
    }
  }
}
