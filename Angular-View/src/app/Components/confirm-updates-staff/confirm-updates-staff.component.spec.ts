import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ConfirmUpdatesStaffComponent } from './confirm-updates-staff.component';
import { StaffService } from '../../Services/staff-sevice.service';
import { CommonModule } from '@angular/common';

describe('ConfirmUpdatesStaffComponent', () => {
  let component: ConfirmUpdatesStaffComponent;
  let fixture: ComponentFixture<ConfirmUpdatesStaffComponent>;
  let mockStaffService: any;
  let mockActivatedRoute: any;
  let routerMock: any;

  beforeEach(async () => {
    mockStaffService = {
      confirmUpdates: jasmine.createSpy('confirmUpdates').and.returnValue(of({}))
    };

    mockActivatedRoute = {
      queryParams: of({ phoneNumber: '+3511234567890', email: 'test@example.com', token: 'abc123' })
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, ConfirmUpdatesStaffComponent],
      providers: [
        { provide: StaffService, useValue: mockStaffService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmUpdatesStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with query params', () => {
    component.ngOnInit();
    expect(component.phoneNumber).toBe('+3511234567890');
    expect(component.email).toBe('test@example.com');
    expect(component.token).toBe('abc123');
  });

  it('should confirm updates successfully', () => {
    component.updateContactInfo();
    expect(mockStaffService.confirmUpdates).toHaveBeenCalledWith({
      token: 'abc123',
      phoneNumber: '+3511234567890',
      email: 'test@example.com'
    });
    expect(component.updateSuccessful).toBe(true);
    expect(component.errorMessage).toBe('');
  });

  it('should handle error when confirming updates fails', () => {
    mockStaffService.confirmUpdates.and.returnValue(throwError({ status: 400, error: { message: 'Confirmation failed' } }));
    component.updateContactInfo();
    expect(mockStaffService.confirmUpdates).toHaveBeenCalledWith({
      token: 'abc123',
      phoneNumber: '+3511234567890',
      email: 'test@example.com'
    });
    expect(component.updateSuccessful).toBe(false);
    expect(component.errorMessage).toBe('Failed to confirm updates');
  });

  it('should navigate to home after successful confirmation', () => {
    component.updateSuccessful = true;
    component.goToHome();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});