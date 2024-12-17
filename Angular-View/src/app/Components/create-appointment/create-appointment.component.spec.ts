import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreateAppointmentComponent } from './create-appointment.component';
import { AppointmentService } from '../../Services/appointment.service';
import { OperationTypeService } from '../../Services/operation-type.service';
import { OperationRequestService } from '../../Services/operation-request.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('CreateAppointmentComponent', () => {
  let component: CreateAppointmentComponent;
  let fixture: ComponentFixture<CreateAppointmentComponent>;
  let appointmentService: AppointmentService;
  let operationTypeService: OperationTypeService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        CreateAppointmentComponent
      ],
      providers: [
        AppointmentService,
        OperationTypeService,
        OperationRequestService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAppointmentComponent);
    component = fixture.componentInstance;
    appointmentService = TestBed.inject(AppointmentService);
    operationTypeService = TestBed.inject(OperationTypeService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch operation requests on init', () => {
    spyOn(component, 'fetchOperationRequests');
    component.ngOnInit();
    expect(component.fetchOperationRequests).toHaveBeenCalled();
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
    component.newAppointment.team = [];

    component.updateTeam(event, 'member1');

    expect(component.newAppointment.team).toEqual(['member1']);
  });

  it('should update team when a member is removed', () => {
    const event = { target: { checked: false } } as unknown as Event;
    component.newAppointment.team = ['member1'];

    component.updateTeam(event, 'member1');

    expect(component.newAppointment.team).toEqual([]);
  });

  it('should create an appointment successfully', () => {
    spyOn(appointmentService, 'createAppointment').and.returnValue(of({}));
    spyOn(component, 'clearForm');
    spyOn(window, 'alert');
    const navigateSpy = spyOn(router, 'navigate');

    component.newAppointment = {
      requestId: '123',
      roomId: '1',
      dateTime: '2023-10-10T10:00:00',
      status: 'scheduled',
      team: ['doctor1', 'nurse1']
    };

    component.createAppointment(new Event('submit'));

    expect(appointmentService.createAppointment).toHaveBeenCalledWith(component.newAppointment);
    expect(component.clearForm).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Appointment created successfully');
    expect(navigateSpy).toHaveBeenCalledWith(['/appointment-manager']);
  });

  it('should handle error during appointment creation', () => {
    spyOn(appointmentService, 'createAppointment').and.returnValue(throwError('Error'));
    spyOn(window, 'alert');

    component.newAppointment = {
      requestId: '123',
      roomId: '1',
      dateTime: '2023-10-10T10:00:00',
      status: 'scheduled',
      team: ['doctor1', 'nurse1']
    };

    component.createAppointment(new Event('submit'));

    expect(appointmentService.createAppointment).toHaveBeenCalledWith(component.newAppointment);
    expect(window.alert).toHaveBeenCalledWith('Error creating appointment');
  });
});
