import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { UpdatePatientComponent } from './update-patient.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { PatientService } from '../../Services/patient.service';

describe('UpdatePatientComponent', () => {
  let component: UpdatePatientComponent;
  let fixture: ComponentFixture<UpdatePatientComponent>;
  let mockPatientService: any;

  beforeEach(async () => {
    mockPatientService = {
      getPatientsWithAdvancedFilter: jasmine.createSpy('getPatientsWithAdvancedFilter').and.returnValue(of([{
        firstName: 'Test',
        lastName: 'Patient',
        fullName: 'Test Patient',
        email: 'test@example.com',
        phoneNumber: '+1234567890',
        emergencyContact: '+1234567890',
        allergies: ['None'],
        medicalConditions: ['None']
      }])),
      updatePatient: jasmine.createSpy('updatePatient').and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, HttpClientTestingModule, UpdatePatientComponent, SidebarComponent],
      providers: [
        { provide: PatientService, useValue: mockPatientService },
      ]
    })
      .compileComponents();

    // Mock the URL to include a medical record number
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost:4200/update-patient/202411000001'
      },
      writable: true
    });

    window.alert = jest.fn();
    console.error = jest.fn();
    console.log = jest.fn();

    fixture = TestBed.createComponent(UpdatePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch patient details on init', () => {
    component.ngOnInit();
    expect(mockPatientService.getPatientsWithAdvancedFilter).toHaveBeenCalled();
    expect(component.existingPatient.firstName).toBe('Test');
  });

  it('should update patient details', () => {
    component.existingPatient.firstName = 'Updated';
    component.updatePatientDetails(new Event('submit'));
    expect(mockPatientService.updatePatient).toHaveBeenCalledWith('202411000001', component.existingPatient);
  });

  it('should handle error when updating patient details', () => {
    mockPatientService.updatePatient.and.returnValue(throwError({ error: 'Update failed' }));
    spyOn(window, 'alert');
    component.updatePatientDetails(new Event('submit'));
    expect(window.alert).toHaveBeenCalledWith('Error updating patient[object Object]');
  });

  it('should clear the form', () => {
    component.clearForm();
    expect(component.existingPatient.firstName).toBe('');
    expect(component.existingPatient.lastName).toBe('');
    expect(component.existingPatient.fullName).toBe('');
    expect(component.existingPatient.email).toBe('');
    expect(component.existingPatient.phoneNumber).toBe('');
    expect(component.existingPatient.emergencyContact).toBe('');
    expect(component.existingPatient.allergies).toEqual([]); // Change this line to use toEqual
    expect(component.existingPatient.medicalConditions).toEqual([]); // Change this line to use toEqual
  });
});
