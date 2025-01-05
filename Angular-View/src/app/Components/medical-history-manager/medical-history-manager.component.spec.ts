 /**
     * @fileoverview This file contains the test suite for the MedicalHistoryManagerComponent.
     * 
     * @author Vasco Sousa (1221700)
     * @date 11/12/2024
     * 
     * @description
     * This file includes unit tests for the MedicalHistoryManagerComponent. It tests various functionalities
     * such as displaying patient data, handling user interactions, and ensuring proper data binding.
     * 
     * @methods
     * - Test cases for displaying patient data
     * - Test cases for handling user interactions
     * - Test cases for data binding and component initialization
     */

    /**
     * Represents the data structure for a patient's medical history.
     * 
     * @typedef {Object} PatientData
     * @property {string} medicalRecordNumber - The unique identifier for the patient's medical record.
     * @property {string} firstName - The first name of the patient.
     * @property {string} lastName - The last name of the patient.
     * @property {string} fullName - The full name of the patient.
     * @property {string} dateOfBirth - The date of birth of the patient in MM/DD/YYYY format.
     * @property {number} gender - The gender of the patient (1 for male, 2 for female, etc.).
     * @property {string} email - The email address of the patient.
     * @property {string} phoneNumber - The phone number of the patient.
     * @property {string} emergencyContact - The emergency contact number for the patient.
     * @property {string} medicalConditions - Any medical conditions the patient has.
     * @property {Array} appointmentHistory - The history of appointments for the patient.
     * @property {boolean} isActive - Indicates whether the patient is currently active.
     */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { PatientService } from '../../Services/patient.service';
import { MedicalHistoryService } from '../../Services/medical-history.service';
import { MedicalConditionService } from '../../Services/medical-condition.service';
import { AllergyService } from '../../Services/allergy.service';
import { PanelService } from '../../Services/panel.service';
import { MedicalHistoryManagerComponent } from './medical-history-manager.component';

describe('MedicalHistoryManagerComponent', () => {
  let component: MedicalHistoryManagerComponent;
  let fixture: ComponentFixture<MedicalHistoryManagerComponent>;
  let patientServiceMock: jest.Mocked<PatientService>;
  let medicalHistoryServiceMock: jest.Mocked<MedicalHistoryService>;
  let medicalConditionServiceMock: jest.Mocked<MedicalConditionService>;
  let allergyServiceMock: jest.Mocked<AllergyService>;
  let panelServiceMock: jest.Mocked<PanelService>;
  let panelIdSubject: Subject<string>;

  beforeEach(async () => {
    const mockPatientService = {
      getPatientsWithAdvancedFilter: jest.fn().mockReturnValue(of([])),
      deletePatient: jest.fn().mockReturnValue(of({}))
    };
    const mockMedicalHistoryService = {
      getPatientMedicalHistory: jest.fn().mockReturnValue(of({}))
    };
    const mockMedicalConditionService = {
      getMedicalConditions: jest.fn().mockReturnValue(of({ isSuccess: true, _value: [] }))
    };
    const mockAllergyService = {
      getAllergies: jest.fn().mockReturnValue(of({ isSuccess: true, _value: [] }))
    };
    panelIdSubject = new Subject<string>();
    const mockPanelService = {
      setPanelId: jest.fn(),
      panelId$: panelIdSubject.asObservable()
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MedicalHistoryManagerComponent],
      providers: [
        { provide: PatientService, useValue: mockPatientService },
        { provide: MedicalHistoryService, useValue: mockMedicalHistoryService },
        { provide: MedicalConditionService, useValue: mockMedicalConditionService },
        { provide: AllergyService, useValue: mockAllergyService },
        { provide: PanelService, useValue: mockPanelService },
        { provide: ActivatedRoute, useValue: { params: of({}) } }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MedicalHistoryManagerComponent);
    component = fixture.componentInstance;
    patientServiceMock = TestBed.inject(PatientService) as jest.Mocked<PatientService>;
    medicalHistoryServiceMock = TestBed.inject(MedicalHistoryService) as jest.Mocked<MedicalHistoryService>;
    medicalConditionServiceMock = TestBed.inject(MedicalConditionService) as jest.Mocked<MedicalConditionService>;
    allergyServiceMock = TestBed.inject(AllergyService) as jest.Mocked<AllergyService>;
    panelServiceMock = TestBed.inject(PanelService) as jest.Mocked<PanelService>;
    fixture.detectChanges();

    window.alert = jest.fn();
    window.confirm = jest.fn().mockReturnValue(true);
    console.error = jest.fn();
    console.log = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch patients', () => {
    component.fetchPatients();
    expect(patientServiceMock.getPatientsWithAdvancedFilter).toHaveBeenCalled();
  });

  it('should fetch allergies', () => {
    component.fetchAllergies();
    expect(allergyServiceMock.getAllergies).toHaveBeenCalled();
  });

  it('should fetch medical conditions', () => {
    component.fetchMedicalConditions();
    expect(medicalConditionServiceMock.getMedicalConditions).toHaveBeenCalled();
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
  it('should fetch medical history', () => {
    const medicalRecordNumber = '20241116';
    const medicalHistoryData = {
      id: '1',
      patientMedicalRecordNumber: '20241116',
      medicalConditions: 'Condition1,Condition2',
      allergies: 'Allergy1,Allergy2',
      freeText: 'Some text',
      familyHistory: 'Father: Condition1; Mother: Condition2'
    };
    medicalHistoryServiceMock.getPatientMedicalHistory.mockReturnValueOnce(of(medicalHistoryData));
    component.fetchMedicalHistory(medicalRecordNumber);
    expect(medicalHistoryServiceMock.getPatientMedicalHistory).toHaveBeenCalledWith(medicalRecordNumber);
    expect(component.selectedMedicalHistory).toEqual({
      id: '1',
      patientMedicalRecordNumber: '20241116',
      medicalConditions: ['Condition1', 'Condition2'],
      allergies: ['Allergy1', 'Allergy2'],
      freeText: 'Some text',
      familyHistory: ['Father: Condition1; Mother: Condition2']
    });
  });

  it('should search allergies', () => {
    component.allergySearch = 'Allergy1';
    component.selectedAllergies = [
      { id: '1', allergyName: 'Allergy1' },
      { id: '2', allergyName: 'Allergy2' }
    ];
    component.searchAllergies();
    expect(component.filteredAllergies).toEqual([{ id: '1', allergyName: 'Allergy1' }]);
  });

  it('should search medical conditions', () => {
    component.medicalConditionSearch = 'Condition1';
    component.selectedMedicalConditions = [
      { id: '1', medicalConditionName: 'Condition1' },
      { id: '2', medicalConditionName: 'Condition2' }
    ];
    component.searchMedicalConditions();
    expect(component.filteredMedicalConditions).toEqual([{ id: '1', medicalConditionName: 'Condition1' }]);
  });

  it('should delete patient', () => {
    const medicalRecordNumber = '20241116';
    const patientName = 'John Doe';
    component.deletePatient(medicalRecordNumber, patientName);
    expect(window.confirm).toHaveBeenCalledWith(`Are you sure you want to delete patient ${medicalRecordNumber} called ${patientName}?`);
    expect(patientServiceMock.deletePatient).toHaveBeenCalledWith(medicalRecordNumber);
  });

  it('should refresh patient list', () => {
    component.patients = [
      { medicalRecordNumber: '20241116', fullName: 'John Doe' },
      { medicalRecordNumber: '20241117', fullName: 'Jane Doe' }
    ];
    component.refreshPatientList('20241116');
    expect(component.patients).toEqual([{ medicalRecordNumber: '20241117', fullName: 'Jane Doe' }]);
  });

  it('should open medical history modal', () => {
    component.openMedicalHistoryModal();
    expect(component.isMedicalHistoryModalOpen).toBe(true);
  });

  it('should close medical history modal', () => {
    component.closeMedicalHistoryModal();
    expect(component.isMedicalHistoryModalOpen).toBe(false);
  });

  it('should filter selected allergies', () => {
    component.allergies = [
      { id: '1', allergyName: 'Allergy1' },
      { id: '2', allergyName: 'Allergy2' }
    ];
    component.selectedMedicalHistory = {
      id: '1',
      patientMedicalRecordNumber: '20241116',
      medicalConditions: [],
      allergies: ['1'],
      freeText: '',
      familyHistory: []
    };
    component.filterSelectedAllergies();
    expect(component.selectedAllergies).toEqual([{ id: '1', allergyName: 'Allergy1' }]);
  });

  it('should filter selected medical conditions', () => {
    component.medicalConditions = [
      { id: '1', medicalConditionName: 'Condition1' },
      { id: '2', medicalConditionName: 'Condition2' }
    ];
    component.selectedMedicalHistory = {
      id: '1',
      patientMedicalRecordNumber: '20241116',
      medicalConditions: ['1'],
      allergies: [],
      freeText: '',
      familyHistory: []
    };
    component.filterSelectedMedicalConditions();
    expect(component.selectedMedicalConditions).toEqual([{ id: '1', medicalConditionName: 'Condition1' }]);
  });
});
