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
import { PanelService } from '../../Services/panel.service';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { StaffService } from '../../Services/staff-sevice.service';

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
  standalone: true,
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
  email: string = '';
  doctors: any[] = [];
  staffProfiles: any[] = [];
  doctorLicenseNumber: string = '';
  currentView: 'Pending' | 'Accepted' = 'Pending';

  constructor(private staffService: StaffService, private panelService: PanelService, private operationRequestService: OperationRequestService) { }

  ngOnInit(): void {
    this.loadStaffProfiles();
    this.panelService.setPanelId("panel-doctor");
    this.fetchOperationRequests();
  }

  toggleView(): void {
    this.currentView = this.currentView === 'Pending' ? 'Accepted' : 'Pending';
    this.fetchOperationRequests();
  }

  // Fetch all operation requests
  fetchOperationRequests(): void {
    this.operationRequestService.getOperationRequests().subscribe(
      (data: any[]) => {
        console.log('Operation requests fetched:', data);
        this.operationRequests = data.filter(request =>
          request.doctorLicenseNumber === this.doctorLicenseNumber &&
          request.status === this.currentView
        );
        console.log('Filtered operation requests:', this.operationRequests);
      },
      error => {
        console.error('Error fetching operation requests', error);
      }
    );
  }

  loadStaffProfiles(): void {
    this.staffService.getAllStaffs().subscribe({
      next: (data: any[]) => {
        console.log("Data staff profiles:\n", data);
        this.staffProfiles = data;
        const token = localStorage.getItem('token');
        if (token) {
          console.log('Token:', token);
          const decodedToken: any = jwtDecode(token);
          console.log('Decoded Token:', decodedToken);
          this.email = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
          console.log('Email:', this.email);
          this.doctors = this.staffProfiles.filter(profile => profile.email === this.email);
          if (this.doctors.length > 0) {
            this.doctorLicenseNumber = this.doctors[0].licenseNumber;
            console.log('Doctor license number:', this.doctorLicenseNumber);
            this.fetchOperationRequests();
          }
        }
        console.log('Doctors:', this.doctors);
      },
      error: (error: { status: number; }) => {
        console.error('Error loading staff profiles', error);
        this.staffProfiles = [];
        if (error.status === 401) {
          alert('Unauthorized page access');
        } else {
          alert('Error loading staff profiles');
        }
      }
    });
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

  searchOperationRequests(): void {
    if (this.searchTerm) {
      this.operationRequests = this.operationRequests.filter(request =>
        request.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.fetchOperationRequests();
    }
  }
}
