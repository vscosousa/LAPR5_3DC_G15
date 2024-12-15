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

@Component({
  selector: 'app-create-appointment',
  standalone: true,
  imports: [FormsModule, SidebarComponent, RouterModule, CommonModule],
  templateUrl: './create-appointment.component.html',
  styleUrl: './create-appointment.component.scss'
})
export class CreateAppointmentComponent implements OnInit {
  operationRequests: any[] = [];
  selectedOperationRequest: any;
  selectedOperationType: any;

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

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private operationTypeService: OperationTypeService,
    private operationRequestService: OperationRequestService
  ) { }

  ngOnInit() {
    this.fetchOperationRequests();
  }

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

  clearForm() {
    this.newAppointment = {
      requestId: '',
      roomId: '',
      dateTime: '',
      status: 'scheduled',
      team: [],
    };
  }

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
