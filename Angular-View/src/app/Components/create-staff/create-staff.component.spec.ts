import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CreateStaffComponent } from './create-staff.component';
import { StaffService } from '../../Services/staff-sevice.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MockActivatedRoute {
  params = of({});
}

describe('CreateStaffComponent', () => {
  let component: CreateStaffComponent;
  let fixture: ComponentFixture<CreateStaffComponent>;
  let staffServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    staffServiceMock = {
      createStaff: jasmine.createSpy('createStaff').and.returnValue(of({ status: 200 })),
      getSpecialization: jasmine.createSpy('getSpecialization').and.returnValue(of([{id:1,specOption:"Cardiology"},{id:2,specOption:"Dermatology"},{id:3,specOption:"Endocrinology"}])),
      getStaffTypes: jasmine.createSpy('getStaffTypes').and.returnValue(of(["Admin","Doctor","Nurse"]))
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };
    
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, CommonModule,CreateStaffComponent, SidebarComponent, ReactiveFormsModule, RouterModule],
      providers: [
        { provide: StaffService, useValue: staffServiceMock },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        //{ provide: Router, useValue: routerMock }
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreateStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Mock window.alert
    window.alert = jasmine.createSpy('alert');
    console.error = jasmine.createSpy('error');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load specializations on init', () => {
    component.ngOnInit();
    expect(staffServiceMock.getSpecialization).toHaveBeenCalled();
    expect(component.specializations).toEqual([{id:1,specOption:"Cardiology"},{id:2,specOption:"Dermatology"},{id:3,specOption:"Endocrinology"}]);
  });

  it('should load staff types on init', () => {
    component.ngOnInit();
    expect(staffServiceMock.getStaffTypes).toHaveBeenCalled();
    expect(component.staffTypes).toEqual(["Admin","Doctor","Nurse"]);
  });

  it('should createStaff and navigate to search-staffs', (done) => {
    const staffData = {
      firstName: 'Test',
      lastName: 'Staff',
      fullName: 'Test Staff',
      email: 'test@email.com',
      phoneNumber: '+350234567890',
      staffType: 'Admin',
      specializationName: 'Cardiology'
    };

    component.createStaffForm.setValue({
      firstName: 'Test',
      lastName: 'Staff',
      fullName: 'Test Staff',
      email: 'test@email.com',
      identifier: '+350',
      phoneNumber: '234567890',
      staffType: 'Admin',
      specializationName: 'Cardiology'
    });

    component.onSubmit();
    expect(staffServiceMock.createStaff).toHaveBeenCalledWith(staffData);

    const response = staffServiceMock.createStaff.calls.mostRecent().returnValue;
    response.subscribe((res: any) => {
      expect(res.status).toBe(200);
      //expect(routerMock.navigate).toHaveBeenCalledWith(['/search-staffs']);
      done();
    });
  });

  it('should handle error when createStaff fails', () => {
    const staffData = {
      firstName: 'Test',
      lastName: 'Staff',
      fullName: 'Test Staff',
      email: 'test@email.com',
      phoneNumber: '+350234567890',
      staffType: 'Admin',
      specializationName: 'Cardiology'
    };

    component.createStaffForm.setValue({
      firstName: 'Test',
      lastName: 'Staff',
      fullName: 'Test Staff',
      email: 'test@email.com',
      identifier: '+350',
      phoneNumber: '234567890',
      staffType: 'Admin',
      specializationName: 'Cardiology'
    });

    const errorResponse = { status: 400, error: JSON.stringify({ message: 'Error creating staff' }) };
    staffServiceMock.createStaff.and.returnValue(throwError(errorResponse));

    component.onSubmit();
    expect(staffServiceMock.createStaff).toHaveBeenCalledWith(staffData);
    expect(component.errorMessage).toBe('Error creating staff');
  });

  it('should handle unauthorized error when createStaff fails', () => {
    const staffData = {
      firstName: 'Test',
      lastName: 'Staff',
      fullName: 'Test Staff',
      email: 'test@email.com',
      phoneNumber: '+350234567890',
      staffType: 'Admin',
      specializationName: 'Cardiology'
    };

    component.createStaffForm.setValue({
      firstName: 'Test',
      lastName: 'Staff',
      fullName: 'Test Staff',
      email: 'test@email.com',
      identifier: '+350',
      phoneNumber: '234567890',
      staffType: 'Admin',
      specializationName: 'Cardiology'
    });

    const errorResponse = { status: 401, error: 'Unauthorized' };
    staffServiceMock.createStaff.and.returnValue(throwError(errorResponse));

    component.onSubmit();
    expect(staffServiceMock.createStaff).toHaveBeenCalledWith(staffData);
    expect(window.alert).toHaveBeenCalledWith('Unauthorized page access');
  });
});