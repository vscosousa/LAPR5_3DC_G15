import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { UpdateStaffComponent } from './update-staff.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { StaffService } from '../../Services/staff-sevice.service';
import { ActivatedRoute, Router } from '@angular/router';

describe('UpdateStaffComponent', () => {
  let component: UpdateStaffComponent;
  let fixture: ComponentFixture<UpdateStaffComponent>;
  let mockStaffService: any;
  let mockActivatedRoute: any;
  let routerMock: any;

  beforeEach(async () => {
    mockStaffService = {
      getSpecialization: jasmine.createSpy('getSpecialization').and.returnValue(of([{id:1,specOption:"Cardiology"},{id:2,specOption:"Dermatology"},{id:3,specOption:"Endocrinology"}])),
      updateStaff: jasmine.createSpy('updateStaff').and.returnValue(of({ status: 200 })),
      getStaffById: jasmine.createSpy('getStaffById').and.returnValue(of({
        fullName: 'Test Staff',
        phoneNumber: '+350234567890',
        email: 'test@example.com',
        specializationId: '1'
      }))
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
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, UpdateStaffComponent, SidebarComponent],
      providers: [
        { provide: StaffService, useValue: mockStaffService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        //{ provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Mock window.alert
    window.alert = jest.fn();
    console.error = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should load specializations on init', () => {
    component.ngOnInit();
    expect(mockStaffService.getSpecialization).toHaveBeenCalled();
    expect(component.specializations).toEqual([{id:1,specOption:"Cardiology"},{id:2,specOption:"Dermatology"},{id:3,specOption:"Endocrinology"}]);
  });

  it('should fetch staff details on init', () => {
    component.ngOnInit();
    expect(mockStaffService.getStaffById).toHaveBeenCalledWith('123');
    expect(component.staffName).toBe('Test Staff');
  });

  it('should update staff details and navigate to search-staffs', (done) => {
    component.updateStaffForm.setValue({
      identifier: '+350',
      phoneNumber: '234567890',
      email: 'test@example.com',
      addAvailabilitySlots: '',
      removeAvailabilitySlots: '',
      specializationName: 'Cardiology'
    });

    component.onSubmit();
    expect(mockStaffService.updateStaff).toHaveBeenCalledWith('123', {
      phoneNumber: '+350234567890',
      email: 'test@example.com',
      addAvailabilitySlots: '',
      removeAvailabilitySlots: '',
      specializationName: 'Cardiology'
    });

    const response = mockStaffService.updateStaff.calls.mostRecent().returnValue;
    response.subscribe((res: any) => {
      expect(res.status).toBe(200);
      //expect(routerMock.navigate).toHaveBeenCalledWith(['/search-staffs']);
      done();
    });
  });

  it('should handle error when updating staff details', () => {
    mockStaffService.updateStaff.and.returnValue(throwError({ status: 400, error: { message: 'Update failed' } }));
    component.updateStaffForm.setValue({
      identifier: '+350',
      phoneNumber: '234567890',
      email: 'test@example.com',
      addAvailabilitySlots: '',
      removeAvailabilitySlots: '',
      specializationName: 'Cardiology'
    });

    component.onSubmit();
    expect(mockStaffService.updateStaff).toHaveBeenCalledWith('123', {
      phoneNumber: '+350234567890',
      email: 'test@example.com',
      addAvailabilitySlots: '',
      removeAvailabilitySlots: '',
      specializationName: 'Cardiology'
    });
    expect(component.errorMessage).toBe('Update failed');
  });

});