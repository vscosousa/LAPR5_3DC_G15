import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ActiveStaffComponent } from './active-staff.component';
import { StaffService } from '../../Services/staff-sevice.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('ActiveStaffComponent', () => {
  let component: ActiveStaffComponent;
  let fixture: ComponentFixture<ActiveStaffComponent>;
  let mockStaffService: any;
  let mockActivatedRoute: any;
  let routerMock: any;

  beforeEach(async () => {
    mockStaffService = {
      activateUser: jasmine.createSpy('activateUser').and.returnValue(of({}))
    };

    mockActivatedRoute = {
      queryParams: of({ token: 'test-token' })
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule,ActiveStaffComponent],
      providers: [
        { provide: StaffService, useValue: mockStaffService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with token from query params', () => {
    component.ngOnInit();
    expect(component.token).toBe('test-token');
  });

  it('should display error if passwords do not match', () => {
    component.newPassword = 'password1';
    component.confirmPassword = 'password2';
    component.activateUser();
    expect(component.errorMessage).toBe('Passwords do not match.');
  });

  it('should display error if passwords are empty', () => {
    component.newPassword = '';
    component.confirmPassword = '';
    component.activateUser();
    expect(component.newPasswordError).toBe(true);
    expect(component.confirmPasswordError).toBe(true);
  });

  it('should activate user successfully', () => {
    component.newPassword = 'password';
    component.confirmPassword = 'password';
    component.activateUser();
    expect(mockStaffService.activateUser).toHaveBeenCalledWith('test-token', 'password');
    expect(component.activationSuccessful).toBe(true);
    expect(component.errorMessage).toBe('');
  });

  it('should handle error when activation fails', () => {
    mockStaffService.activateUser.and.returnValue(throwError({ status: 400, error: { message: 'Activation failed' } }));
    component.newPassword = 'password';
    component.confirmPassword = 'password';
    component.activateUser();
    expect(mockStaffService.activateUser).toHaveBeenCalledWith('test-token', 'password');
    expect(component.errorMessage).toBe('Activation failed');
  });

  it('should navigate to home after successful activation', () => {
    component.activationSuccessful = true;
    component.goToHome();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});