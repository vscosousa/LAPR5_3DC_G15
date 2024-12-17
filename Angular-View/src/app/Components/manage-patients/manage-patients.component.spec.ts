import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ManagePatientsComponent } from './manage-patients.component';
import { PatientService } from '../../Services/patient.service';
import { PanelService } from '../../Services/panel.service';
import { AllergyService } from '../../Services/allergy.service';
import { MedicalConditionService } from '../../Services/medical-condition.service';
import { MedicalHistoryService } from '../../Services/medical-history.service';
import { Renderer2 } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('ManagePatientsComponent', () => {
  let component: ManagePatientsComponent;
  let fixture: ComponentFixture<ManagePatientsComponent>;
  let patientService: PatientService;
  let panelService: PanelService;
  let allergyService: AllergyService;
  let medicalConditionService: MedicalConditionService;
  let medicalHistoryService: MedicalHistoryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ManagePatientsComponent], // Import the standalone component
      providers: [
        PatientService,
        PanelService,
        AllergyService,
        MedicalConditionService,
        MedicalHistoryService,
        Renderer2,
        { provide: ActivatedRoute, useValue: { params: of({}) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManagePatientsComponent);
    component = fixture.componentInstance;
    patientService = TestBed.inject(PatientService);
    panelService = TestBed.inject(PanelService);
    allergyService = TestBed.inject(AllergyService);
    medicalConditionService = TestBed.inject(MedicalConditionService);
    medicalHistoryService = TestBed.inject(MedicalHistoryService);
    fixture.detectChanges();

    window.alert = jest.fn();
    window.confirm = jest.fn().mockReturnValue(true);
    console.error = jest.fn();
    console.log = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch patients on init', () => {
    spyOn(component, 'fetchPatients');
    component.ngOnInit();
    expect(component.fetchPatients).toHaveBeenCalled();
  });

  it('should fetch allergies on init', () => {
    spyOn(component, 'fetchAllergies');
    component.ngOnInit();
    expect(component.fetchAllergies).toHaveBeenCalled();
  });

  it('should fetch medical conditions on init', () => {
    spyOn(component, 'fetchMedicalConditions');
    component.ngOnInit();
    expect(component.fetchMedicalConditions).toHaveBeenCalled();
  });

  it('should fetch patients successfully', () => {
    const mockPatients = [{ medicalRecordNumber: '123', fullName: 'John Doe' }];
    spyOn(patientService, 'getPatientsWithAdvancedFilter').and.returnValue(of(mockPatients));

    component.fetchPatients();

    expect(patientService.getPatientsWithAdvancedFilter).toHaveBeenCalled();
    expect(component.patients).toEqual(mockPatients);
  });

  it('should handle error while fetching patients', () => {
    spyOn(patientService, 'getPatientsWithAdvancedFilter').and.returnValue(throwError('Error'));
    spyOn(console, 'error');

    component.fetchPatients();

    expect(patientService.getPatientsWithAdvancedFilter).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error fetching patients', 'Error');
  });

  it('should fetch allergies successfully', () => {
    const mockAllergies = [{ id: 'A1', allergyName: 'Peanuts' }];
    spyOn(allergyService, 'getAllergies').and.returnValue(of({ isSuccess: true, _value: mockAllergies }));

    component.fetchAllergies();

    expect(allergyService.getAllergies).toHaveBeenCalled();
    expect(component.allergies).toEqual(mockAllergies);
    expect(component.filteredAllergies).toEqual(mockAllergies);
  });

  it('should handle error while fetching allergies', () => {
    spyOn(allergyService, 'getAllergies').and.returnValue(throwError('Error'));
    spyOn(console, 'error');

    component.fetchAllergies();

    expect(allergyService.getAllergies).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error fetching allergies', 'Error');
  });

  it('should fetch medical conditions successfully', () => {
    const mockConditions = [{ id: 'C1', medicalConditionName: 'Asthma' }];
    spyOn(medicalConditionService, 'getMedicalConditions').and.returnValue(of({ isSuccess: true, _value: mockConditions }));

    component.fetchMedicalConditions();

    expect(medicalConditionService.getMedicalConditions).toHaveBeenCalled();
    expect(component.medicalConditions).toEqual(mockConditions);
    expect(component.filteredMedicalConditions).toEqual(mockConditions);
  });

  it('should handle error while fetching medical conditions', () => {
    spyOn(medicalConditionService, 'getMedicalConditions').and.returnValue(throwError('Error'));
    spyOn(console, 'error');

    component.fetchMedicalConditions();

    expect(medicalConditionService.getMedicalConditions).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error fetching medical conditions', 'Error');
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
    spyOn(component, 'filterPatients');

    component.applyFilters(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(component.filterPatients).toHaveBeenCalled();
  });

  it('should filter patients successfully', () => {
    const mockPatients = [{ medicalRecordNumber: '123', fullName: 'John Doe' }];
    spyOn(patientService, 'getPatientsWithAdvancedFilter').and.returnValue(of(mockPatients));

    component.filterPatients('firstName=John&lastName=Doe');

    expect(patientService.getPatientsWithAdvancedFilter).toHaveBeenCalled();
    expect(component.patients).toEqual(mockPatients);
  });

  it('should handle error while filtering patients', () => {
    spyOn(patientService, 'getPatientsWithAdvancedFilter').and.returnValue(throwError('Error'));
    spyOn(console, 'error');

    component.filterPatients('firstName=John&lastName=Doe');

    expect(patientService.getPatientsWithAdvancedFilter).toHaveBeenCalled();
    expect(component.patients).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Error fetching patients', 'Error');
  });

  it('should clear filters', () => {
    spyOn(component, 'fetchPatients');

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
    expect(component.fetchPatients).toHaveBeenCalled();
  });

  it('should delete patient', () => {
    const medicalRecordNumber = '20241116';
    const patientName = 'John Doe';
    spyOn(patientService, 'deletePatient').and.returnValue(of({}));
    spyOn(component, 'refreshPatientList');

    component.deletePatient(medicalRecordNumber, patientName);

    expect(window.confirm).toHaveBeenCalledWith(`Are you sure you want to delete patient ${medicalRecordNumber} called ${patientName}?`);
    expect(patientService.deletePatient).toHaveBeenCalledWith(medicalRecordNumber);
    expect(window.alert).toHaveBeenCalledWith('Patient deleted successfully');
    expect(component.refreshPatientList).toHaveBeenCalledWith(medicalRecordNumber);
  });

  it('should handle error while deleting patient', () => {
    const medicalRecordNumber = '20241116';
    const patientName = 'John Doe';
    spyOn(patientService, 'deletePatient').and.returnValue(throwError('Error'));
    spyOn(console, 'error');

    component.deletePatient(medicalRecordNumber, patientName);

    expect(window.confirm).toHaveBeenCalledWith(`Are you sure you want to delete patient ${medicalRecordNumber} called ${patientName}?`);
    expect(patientService.deletePatient).toHaveBeenCalledWith(medicalRecordNumber);
    expect(console.error).toHaveBeenCalledWith('Error deleting Patient:', 'Error');
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
    spyOn(patientService, 'getPatientsWithAdvancedFilter').and.returnValue(of(patientData));
    spyOn(component, 'fetchMedicalHistory');

    component.viewPatientDetails(medicalRecordNumber);

    expect(patientService.getPatientsWithAdvancedFilter).toHaveBeenCalledWith(undefined, undefined, undefined, undefined, medicalRecordNumber);
    expect(component.selectedPatient).toEqual(patientData[0]);
    expect(component.fetchMedicalHistory).toHaveBeenCalledWith(medicalRecordNumber);
  });

  it('should fetch medical history successfully', () => {
    const medicalRecordNumber = '20241116';
    const mockMedicalHistory = {
      id: '1',
      patientMedicalRecordNumber: '20241116',
      medicalConditions: 'Asthma',
      allergies: 'Peanuts'
    };
    spyOn(medicalHistoryService, 'getPatientMedicalHistory').and.returnValue(of(mockMedicalHistory));
    spyOn(component, 'filterSelectedAllergies');
    spyOn(component, 'filterSelectedMedicalConditions');

    component.fetchMedicalHistory(medicalRecordNumber);

    expect(medicalHistoryService.getPatientMedicalHistory).toHaveBeenCalledWith(medicalRecordNumber);
    expect(component.selectedMedicalHistory).toEqual({
      id: '1',
      patientMedicalRecordNumber: '20241116',
      medicalConditions: ['Asthma'],
      allergies: ['Peanuts']
    });
    expect(component.filterSelectedAllergies).toHaveBeenCalled();
    expect(component.filterSelectedMedicalConditions).toHaveBeenCalled();
  });

  it('should handle error while fetching medical history', () => {
    const medicalRecordNumber = '20241116';
    spyOn(medicalHistoryService, 'getPatientMedicalHistory').and.returnValue(throwError({ status: 404 }));
    spyOn(console, 'error');

    component.fetchMedicalHistory(medicalRecordNumber);

    expect(medicalHistoryService.getPatientMedicalHistory).toHaveBeenCalledWith(medicalRecordNumber);
    expect(component.selectedMedicalHistory).toBeUndefined();
    expect(component.selectedAllergies).toEqual([]);
    expect(component.selectedMedicalConditions).toEqual([]);
    expect(component.filteredAllergies).toEqual([]);
    expect(component.filteredMedicalConditions).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Medical history not found (404)');
  });

  it('should filter selected allergies', () => {
    component.allergies = [{ id: 'A1', allergyName: 'Peanuts' }];
    component.selectedMedicalHistory = {
      id: '1',
      patientMedicalRecordNumber: '20241116',
      medicalConditions: ['Asthma'],
      allergies: ['A1']
    };

    component.filterSelectedAllergies();

    expect(component.selectedAllergies).toEqual([{ id: 'A1', allergyName: 'Peanuts' }]);
    expect(component.filteredAllergies).toEqual([{ id: 'A1', allergyName: 'Peanuts' }]);
  });

  it('should filter selected medical conditions', () => {
    component.medicalConditions = [{ id: 'C1', medicalConditionName: 'Asthma' }];
    component.selectedMedicalHistory = {
      id: '1',
      patientMedicalRecordNumber: '20241116',
      medicalConditions: ['C1'],
      allergies: ['Peanuts']
    };

    component.filterSelectedMedicalConditions();

    expect(component.selectedMedicalConditions).toEqual([{ id: 'C1', medicalConditionName: 'Asthma' }]);
    expect(component.filteredMedicalConditions).toEqual([{ id: 'C1', medicalConditionName: 'Asthma' }]);
  });

  it('should search allergies', () => {
    component.selectedAllergies = [{ id: 'A1', allergyName: 'Peanuts' }];
    component.allergySearch = 'pea';

    component.searchAllergies();

    expect(component.filteredAllergies).toEqual([{ id: 'A1', allergyName: 'Peanuts' }]);
  });

  it('should search medical conditions', () => {
    component.selectedMedicalConditions = [{ id: 'C1', medicalConditionName: 'Asthma' }];
    component.medicalConditionSearch = 'asth';

    component.searchMedicalConditions();

    expect(component.filteredMedicalConditions).toEqual([{ id: 'C1', medicalConditionName: 'Asthma' }]);
  });

  it('should refresh patient list after deletion', () => {
    component.patients = [{ medicalRecordNumber: '20241116', fullName: 'John Doe' }];

    component.refreshPatientList('20241116');

    expect(component.patients).toEqual([]);
  });
});
