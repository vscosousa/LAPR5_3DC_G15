/**
 * Component for managing appointments.
 * 
 * Author: Vasco Sousa (1221700)
 * Last update: 15/12/2024
 * 
 * @component
 * @selector app-appointment-manager
 * @standalone true
 * @imports [FormsModule, ReactiveFormsModule, CommonModule, RouterModule, SidebarComponent]
 * 
 * @class AppointmentManagerComponent
 * 
 * @property {any} filters - Filters for searching appointments.
 * @property {any[]} appointments - List of appointments.
 * @property {any[]} operationRequests - List of operation requests.
 * @property {any[]} staffList - List of staff members.
 * @property {string[]} statusTypes - List of status types for appointments.
 * 
 * @method ngOnInit Initializes the component and fetches appointments.
 * @method fetchAppointments Fetches all appointments from the service.
 * @method fetchOperationRequests Fetches all operation requests from the service.
 * @method fetchStaffList Fetches the list of staff members.
 */


import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../Services/appointment.service';
import { OperationRequestService } from '../../Services/operation-request.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { StaffService } from '../../Services/staff-sevice.service';

@Component({
  selector: 'app-appointment-manager',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule, SidebarComponent],
  templateUrl: './appointment-manager.component.html',
  styleUrl: './appointment-manager.component.scss',
  providers: [DatePipe]
})
export class AppointmentManagerComponent implements OnInit {

  filters: any = {};
  appointments: any[] = [];
  operationRequests: any[] = [];
  staffList: any[] = [];
  statusTypes = ['Pending', 'Confirmed', 'Cancelled'];

  constructor(
    private appointmentService: AppointmentService,
    private operationRequestService: OperationRequestService,
    private staffService: StaffService, // Add StaffService dependency
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments(): void {
    this.appointmentService.getAppointments().subscribe(
      (response: any) => {
        if (response.isSuccess && response._value) {
          this.appointments = response._value;
          console.log('Appointments fetched:', this.appointments);
          this.fetchOperationRequests();
        } else {
          console.error('Failed to fetch appointments:', response.error);
        }
      },
      error => {
        console.error('Error fetching appointments', error);
      }
    );
  }

  fetchOperationRequests(): void {
    this.operationRequestService.getOperationRequests().subscribe(
      (data: any[]) => {
        console.log('Operation requests fetched:', data);
        this.operationRequests = data;
        this.mergeAppointmentWithOperationRequests();
      },
      error => {
        console.error('Error fetching operation requests', error);
      }
    );
  }

  mergeAppointmentWithOperationRequests(): void {
    this.appointments = this.appointments.map(appointment => {
      const operationRequest = this.operationRequests.find(request => request.id === appointment.requestId);
      return { ...appointment, operationRequest };
    });
    console.log('Merged appointments:', this.appointments);
    this.fetchStaffList();
  }

  fetchStaffList(): void {
    const staffIds = this.appointments.flatMap(appointment => appointment.team);
    const uniqueStaffIds = [...new Set(staffIds)];

    Promise.all(uniqueStaffIds.map(id => this.staffService.getStaffById(id).toPromise()))
      .then(staffList => {
        this.staffList = staffList;
        this.mergeAppointmentWithStaffList();
      })
      .catch(error => {
        console.error('Error fetching staff list', error);
      });
  }

  mergeAppointmentWithStaffList(): void {
    this.appointments = this.appointments.map(appointment => {
      const teamDetails = appointment.team.map((teamMemberId: any) => {
        return this.staffList.find(staff => staff.id === teamMemberId);
      }).filter((staff: any) => staff !== undefined); // Ensure only matched staff are included
      return { ...appointment, teamDetails };
    });
    console.log('Merged appointments with staff list:', this.appointments);
  }

  getTeamNames(teamDetails: any[], staffType: string): string {
      if (!teamDetails) {
        return '';
      }
      return teamDetails
        .filter(staff => staff.staffType === staffType)
        .map(staff => `${staff.fullName} (${staff.licenseNumber})`)
        .join(', ');
    }

  getDoctorNames(teamDetails: any[]): string {
      return this.getTeamNames(teamDetails, 'Doctor');
    }

  getNurseNames(teamDetails: any[]): string {
      return this.getTeamNames(teamDetails, 'Nurse');
    }
}
