import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ActiveModalComponent } from './active-modal.component';
import { StaffService } from '../../../Services/staff-sevice.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('ActiveModalComponent', () => {
  let component: ActiveModalComponent;
  let fixture: ComponentFixture<ActiveModalComponent>;
  let mockStaffService: any;

  beforeEach(async () => {
    mockStaffService = {
      activateStaff: jasmine.createSpy('activateStaff').and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ActiveModalComponent],
      providers: [
        { provide: StaffService, useValue: mockStaffService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveModalComponent);
    component = fixture.componentInstance;
    component.profile = {
      email: 'test@example.com',
      staffType: 'Admin', // Updated to match the new structure
      id: '123'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error if username is empty', () => {
    component.username = '';
    component.onSubmit();
    expect(component.errorMessage).toBe('Username is required');
  });

  it('should activate user successfully', () => {
    component.username = 'testuser';
    component.onSubmit();
    expect(mockStaffService.activateStaff).toHaveBeenCalledWith({
      email: 'test@example.com',
      username: 'testuser',
      role: 'Admin', // Updated to match the new structure
      staffId: '123'
    });
    expect(component.errorMessage).toBe('');
    expect(component.username).toBe('');
  });

  it('should handle error when activation fails', () => {
    mockStaffService.activateStaff.and.returnValue(throwError({ status: 400, error: { message: 'Activation failed' } }));
    component.username = 'testuser';
    component.onSubmit();
    expect(mockStaffService.activateStaff).toHaveBeenCalledWith({
      email: 'test@example.com',
      username: 'testuser',
      role: 'Admin', // Updated to match the new structure
      staffId: '123'
    });
    expect(component.errorMessage).toBe('Activation failed');
  });

  it('should close modal after successful activation', () => {
    spyOn(component.close, 'emit');
    component.username = 'testuser';
    component.onSubmit();
    expect(mockStaffService.activateStaff).toHaveBeenCalledWith({
      email: 'test@example.com',
      username: 'testuser',
      role: 'Admin', // Updated to match the new structure
      staffId: '123'
    });
    expect(component.close.emit).toHaveBeenCalledWith(true);
  });

  it('should close modal when closeModal is called', () => {
    spyOn(component.close, 'emit');
    component.closeModal();
    expect(component.close.emit).toHaveBeenCalledWith(false);
  });
});
