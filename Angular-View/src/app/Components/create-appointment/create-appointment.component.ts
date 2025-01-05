/**
 * Component for creating a new appointment.
 * 
 * Author: Vasco Sousa (1221700)
 * Last update: 15/12/2024
 * @component
 * @selector app-create-appointment
 * @standalone true
 * @imports [FormsModule, SidebarComponent, RouterModule, CommonModule]
 * 
 * @class CreateAppointmentComponent
 * 
 * @property {any[]} operationRequests - List of operation requests.
 * @property {any} selectedOperationRequest - The selected operation request.
 * @property {any} selectedOperationType - The selected operation type.
 * @property {Object} newAppointment - The new appointment object to be created.
 * @property {any[]} rooms - List of available rooms.
 * @property {any[]} doctors - List of available doctors.
 * @property {any[]} nurses - List of available nurses.
 * @property {any[]} staffProfiles - List of staff profiles.
 * @property {any[]} operationTypes - List of operation types.
 * @property {string} email - Email of the user.
 * 
 * @method ngOnInit Initializes the component and fetches operation requests.
 * @method fetchOperationTypes Fetches all operation types from the service.
 * @method fetchStaffList Fetches the staff list based on the selected operation type.
 * @method createAppointment Submits the form to create a new appointment.
 * @method extractOperationRequestFromUrl Extracts the operation request ID from the URL.
 * @method fetchOperationRequests Fetches all operation requests from the service.
 * @method clearForm Clears the form after creating an appointment.
 * @method updateTeam Updates the team members for the appointment.
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AppointmentService } from '../../Services/appointment.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { OperationTypeService } from '../../Services/operation-type.service';
import { StaffService } from '../../Services/staff-sevice.service';
import { OperationRequestService } from '../../Services/operation-request.service';
import { PanelService } from '../../Services/panel.service';

@Component({
  selector: 'app-create-appointment',
  standalone: true,
  imports: [FormsModule, SidebarComponent, RouterModule, CommonModule],
  templateUrl: './create-appointment.component.html',
  styleUrl: './create-appointment.component.scss'
})
export class CreateAppointmentComponent implements OnInit {
  // List of operation requests
  operationRequests: any[] = [];
  // The selected operation request
  selectedOperationRequest: any;
  // The selected operation type
  selectedOperationType: any;

  // The new appointment object to be created
  newAppointment: {
    requestId: string;
    roomId: string;
    dateTime: string;
    status: string;
    team: string[];
  } = {
      requestId: '',
      roomId: '',
      dateTime: '',
      status: 'scheduled',
      team: [],
    };

  rooms: any[] = [{ id: '1', name: 'Room 1' }];
  doctors: any[] = [];
  nurses: any[] = [];
  staffProfiles: any[] = [];
  operationTypes: any[] = [];
  email: string = '';

  // Constructor to inject the necessary services
  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private operationTypeService: OperationTypeService,
    private operationRequestService: OperationRequestService,
    private panelService: PanelService
  ) { }

  // Lifecycle hook that runs when the component is initialized
  ngOnInit() {
    this.panelService.setPanelId('panel-doctor');
    this.fetchOperationRequests();
  }

  // Method to fetch all operation types from the service
  fetchOperationTypes(): void {
    this.operationTypeService.getOperationTypes().subscribe(
      (data: any[]) => {
        console.log(this.selectedOperationRequest.operationType);
        if (this.selectedOperationRequest) {
          this.operationTypes = data.filter(type =>
            type.name === this.selectedOperationRequest.operationType
          );
        } else {
          this.operationTypes = data;
        }
        this.selectedOperationType = this.operationTypes[0];
        console.log('Filtered operation types:', this.selectedOperationType);

        this.fetchStaffList(this.selectedOperationType);
      },
      (error: any) => {
        console.error('Error fetching operation types', error);
      }
    );
  }

  // Method to fetch the staff list based on the selected operation type
  fetchStaffList(operationType: any): void {
    if (operationType && operationType.staffs) {
      this.doctors = [];
      this.nurses = [];
      operationType.staffs.forEach((staff: { staffType: string; }) => {
        if (staff.staffType === 'Doctor') {
          this.doctors.push(staff);
        } else if (staff.staffType === 'Nurse') {
          this.nurses.push(staff);
        }
      });
      console.log('Fetched doctors list:', this.doctors);
      console.log('Fetched nurses list:', this.nurses);
    } else {
      console.error('No staff list found for the selected operation type');
    }
  }

  // Method to submit the form and create a new appointment
  createAppointment(event: Event) {
    event.preventDefault();
    console.log('Creating appointment with data:', this.newAppointment); // Add this line for debugging
    this.appointmentService.createAppointment(this.newAppointment).subscribe(
      (response: any) => {
        console.log('Appointment created:', response);
        this.clearForm();
        alert('Appointment created successfully');
        this.router.navigate(['/appointment-manager']);
      },
      (error: any) => {
        console.error('Error creating appointment', error);
        alert('Error creating appointment');
      }
    );
  }

  // Method to extract the operation request ID from the URL
  extractOperationRequestFromUrl() {
    const url = window.location.href;
    const regex = /\/create-appointment\/([0-9a-fA-F-]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1];
    } else {
      throw new Error('Appointment not found in URL.');
    }
  }

  // Method to fetch all operation requests from the service
  fetchOperationRequests(): void {
    this.operationRequestService.getOperationRequests().subscribe(
      (data: any[]) => {
        console.log('Operation requests fetched:', data);
        this.operationRequests = data.filter(request =>
          request.id === this.extractOperationRequestFromUrl()
        );
        console.log('Filtered operation requests:', this.operationRequests);
        if (this.operationRequests.length > 0) {
          this.selectedOperationRequest = this.operationRequests[0];
          this.newAppointment.requestId = this.selectedOperationRequest.id;
          this.fetchOperationTypes();
        } else {
          console.error('No matching operation request found');
        }
      },
      error => {
        console.error('Error fetching operation requests', error);
      }
    );
  }

  // Method to clear the form after creating an appointment
  clearForm() {
    this.newAppointment = {
      requestId: '',
      roomId: '',
      dateTime: '',
      status: 'scheduled',
      team: [],
    };
  }

  // Method to update the team members for the appointment
  updateTeam(event: Event, memberId: string) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.newAppointment.team.push(memberId);
    } else {
      const index = this.newAppointment.team.indexOf(memberId);
      if (index > -1) {
        this.newAppointment.team.splice(index, 1);
      }
    }
    console.log('Updated team:', this.newAppointment.team); // Add this line for debugging
  }
}