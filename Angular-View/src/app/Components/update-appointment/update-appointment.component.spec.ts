    /**
     * @fileoverview This file contains the unit tests for the UpdateAppointmentComponent.
     * 
     * @author Vasco Sousa (1221700)
     * @date 15/12/2024
     * 
     * @description
     * This file includes the following methods:
     * - isSuccess: Indicates whether the appointment update was successful.
     * - _value: Contains the details of the appointment including requestId, roomId, dateTime, status, and team.
     * 
     * @typedef {Object} Appointment
     * @property {boolean} isSuccess - Indicates if the appointment update was successful.
     * @property {Object} _value - The details of the appointment.
     * @property {string} _value.requestId - The ID of the appointment request.
     * @property {string} _value.roomId - The ID of the room where the appointment is scheduled.
     * @property {string} _value.dateTime - The date and time of the appointment.
     * @property {string} _value.status - The status of the appointment.
     * @property {Array<string>} _value.team - The team members involved in the appointment.
     */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UpdateAppointmentComponent } from './update-appointment.component';
import { AppointmentService } from '../../Services/appointment.service';
import { OperationTypeService } from '../../Services/operation-type.service';
import { OperationRequestService } from '../../Services/operation-request.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('UpdateAppointmentComponent', () => {
  let component: UpdateAppointmentComponent;
  let fixture: ComponentFixture<UpdateAppointmentComponent>;
  let appointmentService: AppointmentService;
  let operationTypeService: OperationTypeService;
  let operationRequestService: OperationRequestService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        UpdateAppointmentComponent
      ],
      providers: [
        AppointmentService,
        OperationTypeService,
        OperationRequestService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAppointmentComponent);
    component = fixture.componentInstance;
    appointmentService = TestBed.inject(AppointmentService);
    operationTypeService = TestBed.inject(OperationTypeService);
    operationRequestService = TestBed.inject(OperationRequestService);
    router = TestBed.inject(Router);

    spyOn(component as any, 'getAppointmentIdFromRoute').and.returnValue('123');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load appointment on init', () => {
    spyOn(component, 'loadAppointment');
    component.ngOnInit();
    expect(component.loadAppointment).toHaveBeenCalled();
  });

  it('should load appointment successfully', () => {

    const appointment = {
      isSuccess: true,
      _value: {
        requestId: '123',
        roomId: '1',
        dateTime: '2023-10-10T10:00:00',
        status: 'scheduled',
        team: ['doctor1', 'nurse1']
      }
    };
    spyOn(appointmentService, 'getAppointmentById').and.returnValue(of(appointment));
    spyOn(component, 'fetchOperationRequests');

    component.loadAppointment();

    expect(appointmentService.getAppointmentById).toHaveBeenCalled();
    expect(component.existingAppointment).toEqual(appointment._value);
    expect(component.fetchOperationRequests).toHaveBeenCalled();
  });

  it('should handle error while loading appointment', () => {
    spyOn(appointmentService, 'getAppointmentById').and.returnValue(throwError('Error'));
    spyOn(console, 'error');

    component.loadAppointment();

    expect(appointmentService.getAppointmentById).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error loading appointment', 'Error');
  });

  it('should fetch operation types successfully', () => {
    const operationTypes = [{ name: 'Type1' }, { name: 'Type2' }];
    spyOn(operationTypeService, 'getOperationTypes').and.returnValue(of(operationTypes));
    spyOn(component, 'fetchStaffList');

    component.selectedOperationRequest = { operationType: 'Type1' };
    component.fetchOperationTypes();

    expect(operationTypeService.getOperationTypes).toHaveBeenCalled();
    expect(component.operationTypes).toEqual([operationTypes[0]]);
    expect(component.selectedOperationType).toEqual(operationTypes[0]);
    expect(component.fetchStaffList).toHaveBeenCalledWith(operationTypes[0]);
  });

  it('should handle error while fetching operation types', () => {
    spyOn(operationTypeService, 'getOperationTypes').and.returnValue(throwError('Error'));
    spyOn(console, 'error');

    component.fetchOperationTypes();

    expect(operationTypeService.getOperationTypes).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error fetching operation types', 'Error');
  });

  it('should fetch staff list based on operation type', () => {
    const operationType = {
      staffs: [
        { staffType: 'Doctor', name: 'Doctor1' },
        { staffType: 'Nurse', name: 'Nurse1' }
      ]
    };

    component.fetchStaffList(operationType);

    expect(component.doctors).toEqual([{ staffType: 'Doctor', name: 'Doctor1' }]);
    expect(component.nurses).toEqual([{ staffType: 'Nurse', name: 'Nurse1' }]);
  });

  it('should handle no staff list for the selected operation type', () => {
    spyOn(console, 'error');

    component.fetchStaffList({});

    expect(component.doctors).toEqual([]);
    expect(component.nurses).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('No staff list found for the selected operation type');
  });

  it('should update team when a member is added', () => {
    const event = { target: { checked: true } } as unknown as Event;
    component.existingAppointment.team = [];

    component.updateTeam(event, 'member1');

    expect(component.existingAppointment.team).toEqual(['member1']);
  });

  it('should update team when a member is removed', () => {
    const event = { target: { checked: false } } as unknown as Event;
    component.existingAppointment.team = ['member1'];

    component.updateTeam(event, 'member1');

    expect(component.existingAppointment.team).toEqual([]);
  });

  it('should update an appointment successfully', () => {
    spyOn(appointmentService, 'updateAppointment').and.returnValue(of({}));
    spyOn(component, 'clearForm');
    spyOn(window, 'alert');
    const navigateSpy = spyOn(router, 'navigate');

    component.existingAppointment = {
      requestId: '123',
      roomId: '1',
      dateTime: '2023-10-10T10:00:00',
      status: 'scheduled',
      team: ['doctor1', 'nurse1']
    };

    component.updateAppointment(new Event('submit'));

    expect(appointmentService.updateAppointment).toHaveBeenCalledWith('123', {
      roomId: '1',
      dateTime: '2023-10-10T10:00:00',
      team: ['doctor1', 'nurse1']
    });
    expect(component.clearForm).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Appointment updated successfully');
    expect(navigateSpy).toHaveBeenCalledWith(['/appointment-manager']);
  });

  it('should handle error during appointment update', () => {
    spyOn(appointmentService, 'updateAppointment').and.returnValue(throwError('Error'));
    spyOn(window, 'alert');

    component.existingAppointment = {
      requestId: '123',
      roomId: '1',
      dateTime: '2023-10-10T10:00:00',
      status: 'scheduled',
      team: ['doctor1', 'nurse1']
    };

    component.updateAppointment(new Event('submit'));

    expect(appointmentService.updateAppointment).toHaveBeenCalledWith('123', {
      roomId: '1',
      dateTime: '2023-10-10T10:00:00',
      team: ['doctor1', 'nurse1']
    });
    expect(window.alert).toHaveBeenCalledWith('Error updating appointment');
  });

  it('should clear the form', () => {
    component.clearForm();
    expect(component.existingAppointment).toEqual({
      requestId: '',
      roomId: '',
      dateTime: '',
      status: 'scheduled',
      team: [],
    });
  });

  it('should fetch operation requests and handle no matching request', () => {
    const operationRequests = [{ id: '456' }];
    spyOn(operationRequestService, 'getOperationRequests').and.returnValue(of(operationRequests));
    spyOn(console, 'error');

    component.existingAppointment.requestId = '123';
    component.fetchOperationRequests();

    expect(operationRequestService.getOperationRequests).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('No matching operation request found');
  });

  it('should fetch operation requests and handle undefined request ID', () => {
    const operationRequests = [{ id: '456' }];
    spyOn(operationRequestService, 'getOperationRequests').and.returnValue(of(operationRequests));
    spyOn(console, 'error');

    component.existingAppointment.requestId = '';
    component.fetchOperationRequests();

    expect(operationRequestService.getOperationRequests).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Existing appointment request ID is undefined');
  });
});

