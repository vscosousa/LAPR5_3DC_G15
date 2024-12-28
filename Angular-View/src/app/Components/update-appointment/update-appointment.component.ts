import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AppointmentService } from '../../Services/appointment.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { OperationTypeService } from '../../Services/operation-type.service';
import { OperationRequestService } from '../../Services/operation-request.service';
import { PanelService } from '../../Services/panel.service';

@Component({
  selector: 'app-update-appointment',
  standalone: true,
  imports: [FormsModule, SidebarComponent, RouterModule, CommonModule],
  templateUrl: './update-appointment.component.html',
  styleUrls: ['./update-appointment.component.scss']
})
export class UpdateAppointmentComponent implements OnInit {
  operationRequests: any[] = [];
  selectedOperationRequest: any;
  selectedOperationType: any;

  existingAppointment: {
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
    private operationRequestService: OperationRequestService,
    private panelService: PanelService
  ) { }

  ngOnInit() {
    this.panelService.setPanelId('panel-doctor');
    this.loadAppointment();
  }

  loadAppointment(): void {
    const appointmentId = this.getAppointmentIdFromRoute();
    this.appointmentService.getAppointmentById(appointmentId).subscribe(
      (response) => {
        if (response.isSuccess) {
          console.log('Appointment loaded:', response._value);
          this.existingAppointment = response._value;
          this.existingAppointment.dateTime = new Date(this.existingAppointment.dateTime).toISOString().slice(0, 16);
          this.fetchOperationRequests();
        } else {
          console.error('Error loading appointment', response.error);
        }
      },
      (error: any) => {
        console.error('Error loading appointment', error);
      }
    );
  }

  fetchOperationTypes(): void {
    this.operationTypeService.getOperationTypes().subscribe(
      (data: any[]) => {
        if (this.selectedOperationRequest) {
          this.operationTypes = data.filter(type =>
            type.name === this.selectedOperationRequest.operationType
          );
        } else {
          this.operationTypes = data;
        }
        this.selectedOperationType = this.operationTypes[0];
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
    } else {
      console.error('No staff list found for the selected operation type');
    }
  }

  updateAppointment(event: Event) {
    event.preventDefault();
    const updatedAppointment = {
      roomId: this.existingAppointment.roomId,
      dateTime: this.existingAppointment.dateTime,
      team: this.existingAppointment.team
    };
    const appointmentId = this.getAppointmentIdFromRoute();
    this.appointmentService.updateAppointment(appointmentId, updatedAppointment).subscribe(
      (response: any) => {
        this.clearForm();
        alert('Appointment updated successfully');
        this.router.navigate(['/appointment-manager']);
      },
      (error: any) => {
        console.error('Error updating appointment', error);
        alert('Error updating appointment');
      }
    );
  }

  fetchOperationRequests(): void {
    this.operationRequestService.getOperationRequests().subscribe(
      (data: any[]) => {
        console.log('Operation requests:', data);
        console.log('Existing appointment:', this.existingAppointment);
        console.log('Existing appointment request ID:', this.existingAppointment.requestId);
        if (this.existingAppointment.requestId) {
          this.operationRequests = data.filter(request =>
            request.id === this.existingAppointment.requestId
          );
          if (this.operationRequests.length > 0) {
            this.selectedOperationRequest = this.operationRequests[0];
            this.existingAppointment.requestId = this.selectedOperationRequest.id;
            this.fetchOperationTypes();
          } else {
            console.error('No matching operation request found');
          }
        } else {
          console.error('Existing appointment request ID is undefined');
        }
      },
      error => {
        console.error('Error fetching operation requests', error);
      }
    );
  }

  clearForm() {
    this.existingAppointment = {
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
      this.existingAppointment.team.push(memberId);
    } else {
      const index = this.existingAppointment.team.indexOf(memberId);
      if (index > -1) {
        this.existingAppointment.team.splice(index, 1);
      }
    }
  }

  private getAppointmentIdFromRoute(): string {
    const url = window.location.href;
    const regex = /\/update-appointment\/([0-9a-fA-F-]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      console.log('Appointment ID:', match[1]);
      return match[1];
    } else {
      throw new Error('Appointment not found in URL.');
    }
  }
}
