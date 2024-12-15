import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PatientService } from '../../Services/patient.service';
import { MedicalHistoryManagerComponent } from './medical-history-manager.component';

// Test suite for MedicalHistoryManagerComponent
// Author: Vasco Sousa (1221700)
// Last Updated: 12/11/2024

describe('MedicalHistoryManagerComponent', () => {
  let component: MedicalHistoryManagerComponent;
  let fixture: ComponentFixture<MedicalHistoryManagerComponent>;
  let patientServiceMock: jest.Mocked<PatientService>;

  beforeEach(async () => {
    const mockPatientService = {
      getPatientsWithAdvancedFilter: jest.fn().mockReturnValue(of([])),
      deletePatient: jest.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MedicalHistoryManagerComponent],
      providers: [
        { provide: PatientService, useValue: mockPatientService },
        { provide: ActivatedRoute, useValue: { params: of({}) } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalHistoryManagerComponent);
    component = fixture.componentInstance;
    patientServiceMock = TestBed.inject(PatientService) as jest.Mocked<PatientService>;
    fixture.detectChanges();

    window.alert = jest.fn();
    window.confirm = jest.fn().mockReturnValue(true);
    console.error = jest.fn();
    console.log = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an apply filters button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const applyFiltersButton = compiled.querySelector('button.btn-filter');
    expect(applyFiltersButton).toBeTruthy();
    expect(applyFiltersButton?.textContent).toContain('Apply Filters');
  });

  it('should have a clear filters button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const clearFiltersButton = compiled.querySelector('button.btn-clear');
    expect(clearFiltersButton).toBeTruthy();
    expect(clearFiltersButton?.textContent).toContain('Clear Filters');
  });

  it('should have a table', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const table = compiled.querySelector('table.table');
    expect(table).toBeTruthy();
  });

  it('should delete patient', () => {
    const medicalRecordNumber = '20241116';
    const patientName = 'John Doe';
    component.deletePatient(medicalRecordNumber, patientName);
    expect(window.confirm).toHaveBeenCalledWith(`Are you sure you want to delete patient ${medicalRecordNumber} called ${patientName}?`);
    expect(patientServiceMock.deletePatient).toHaveBeenCalledWith(medicalRecordNumber);
    expect(window.alert).toHaveBeenCalledWith('Patient deleted successfully');
  });

  it('should view patient details', () => {
    const medicalRecordNumber = '20241116';
    const patientData = [{
      medicalRecordNumber: '20241116',
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      dateOfBirth: '01/01/2000',
      gender: 1,
      email: 'john.doe@example.com',
      phoneNumber: '+1234567890',
      emergencyContact: '+1234567890',
      medicalConditions: 'None',
      appointmentHistory: [],
      isActive: true
    }];
    patientServiceMock.getPatientsWithAdvancedFilter.mockReturnValueOnce(of(patientData));
    component.viewPatientDetails(medicalRecordNumber);
    expect(patientServiceMock.getPatientsWithAdvancedFilter).toHaveBeenCalledWith(undefined, undefined, undefined, undefined, medicalRecordNumber);
    expect(component.selectedPatient).toEqual(patientData[0]);
  });

  it('should apply filters', () => {
    const mockEvent = new Event('submit', {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(mockEvent, 'preventDefault', { value: jest.fn(), writable: true });
    component.filters = {
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      dateOfBirth: '2000-01-01',
      medicalRecordNumber: '12345',
      gender: 'Male',
      email: 'john.doe@example.com',
      phoneNumber: '+1234567890'
    };
    component.applyFilters(mockEvent);
    expect(patientServiceMock.getPatientsWithAdvancedFilter).toHaveBeenCalled();
  });

  it('should clear filters', () => {
    component.clearFilters();
    expect(component.filters).toEqual({
      firstName: '',
      lastName: '',
      fullName: '',
      dateOfBirth: '',
      medicalRecordNumber: '',
      gender: '',
      email: '',
      phoneNumber: ''
    });
    expect(patientServiceMock.getPatientsWithAdvancedFilter).toHaveBeenCalled();
  });
});
