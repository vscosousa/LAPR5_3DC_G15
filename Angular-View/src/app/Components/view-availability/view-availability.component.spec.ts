import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { ViewAvailabilityComponent } from './view-availability.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { StaffService } from '../../Services/staff-sevice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarModule } from 'angular-calendar';

describe('ViewAvailabilityComponent', () => {
  let component: ViewAvailabilityComponent;
  let fixture: ComponentFixture<ViewAvailabilityComponent>;
  let mockStaffService: any;
  let mockActivatedRoute: any;
  let routerMock: any;

  beforeEach(async () => {
    mockStaffService = {
      getStaffById: jasmine.createSpy('getStaffById').and.returnValue(of({
        fullName: 'Test Staff',
        availabilitySlots: ['2023-01-01 08:00', '2023-01-02 09:00']
      })),
      updateStaff: jasmine.createSpy('updateStaff').and.returnValue(of({ status: 200 }))
    };

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('123')
        }
      }
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, CalendarModule, ViewAvailabilityComponent, SidebarComponent],
      providers: [
        { provide: StaffService, useValue: mockStaffService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        //{ provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Mock window.alert
    window.alert = jasmine.createSpy('alert');
    console.error = jasmine.createSpy('error');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch staff details on init', () => {
    component.ngOnInit();
    expect(mockStaffService.getStaffById).toHaveBeenCalledWith('123');
    expect(component.staffName).toBe('Test Staff');
    expect(component.availabilitySlots).toEqual(['2023-01-01 08:00', '2023-01-02 09:00']);
  });

  it('should handle error when fetching staff availability fails', () => {
    mockStaffService.getStaffById.and.returnValue(throwError({ status: 400, error: { message: 'Fetch failed' } }));
    component.ngOnInit();
    expect(mockStaffService.getStaffById).toHaveBeenCalledWith('123');
    expect(window.alert).toHaveBeenCalledWith('Error loading staff details');
  });

  it('should submit availability slots', (done) => {
    component.availabilityForm.setValue({
      date: '2023-01-01',
      selectedHours: [true, false, false, false, false, false, false, false, false, false, false]
    });

    component.onSubmit();
    expect(mockStaffService.updateStaff).toHaveBeenCalledWith('123', {
      phoneNumber: '',
      email: '',
      addAvailabilitySlots: '2023-01-01 08:00',
      removeAvailabilitySlots: '2023-01-01 09:00,2023-01-01 10:00,2023-01-01 11:00,2023-01-01 12:00,2023-01-01 13:00,2023-01-01 14:00,2023-01-01 15:00,2023-01-01 16:00,2023-01-01 17:00,2023-01-01 18:00',
      specializationName: ''
    });

    const response = mockStaffService.updateStaff.calls.mostRecent().returnValue;
    response.subscribe((res: any) => {
      expect(res.status).toBe(200);
      done();
    });
  });

  it('should handle error when submitting availability slots fails', () => {
    mockStaffService.updateStaff.and.returnValue(throwError({ status: 400, error: { message: 'Update failed' } }));
    component.availabilityForm.setValue({
      date: '2023-01-01',
      selectedHours: [true, false, false, false, false, false, false, false, false, false, false]
    });

    component.onSubmit();
    expect(mockStaffService.updateStaff).toHaveBeenCalledWith('123', {
      phoneNumber: '',
      email: '',
      addAvailabilitySlots: '2023-01-01 08:00',
      removeAvailabilitySlots: '2023-01-01 09:00,2023-01-01 10:00,2023-01-01 11:00,2023-01-01 12:00,2023-01-01 13:00,2023-01-01 14:00,2023-01-01 15:00,2023-01-01 16:00,2023-01-01 17:00,2023-01-01 18:00',
      specializationName: ''
    });
    expect(component.errorMessage).toBe('Update failed');
  });
});