import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CreatePatientComponent } from './create-patient.component';
import { PatientService } from '../../Services/patient.service';

class MockActivatedRoute {
  params = of({});
}

describe('CreatePatientComponent', () => {
  let component: CreatePatientComponent;
  let fixture: ComponentFixture<CreatePatientComponent>;
  let patientServiceMock: jest.Mocked<PatientService>;

  beforeEach(async () => {
    const mockPatientService = {
      createPatient: jest.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CreatePatientComponent],
      providers: [
        { provide: PatientService, useValue: mockPatientService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreatePatientComponent);
    component = fixture.componentInstance;
    patientServiceMock = TestBed.inject(PatientService) as jest.Mocked<PatientService>;
    fixture.detectChanges();

    // Mock window.alert
    window.alert = jest.fn();
    console.error = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should createPatient', () => {
    const patientData = {
      firstName: 'Test',
      lastName: 'Patient',
      fullName: 'Test Patient',
      dateOfBirth: '01/01/2000',
      genderOptions: '1',
      email: 'test@email.com',
      phoneNumber: '+1234567890',
      emergencyContact: '+1234567890',
      allergies: [],
      medicalConditions: []
    };

    component.newPatient = patientData;

    const mockEvent = new Event('submit', {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(mockEvent, 'preventDefault', { value: jest.fn(), writable: true });

    component.createPatient(mockEvent);
    expect(patientServiceMock.createPatient).toHaveBeenCalledWith(patientData);
    expect(window.alert).toHaveBeenCalledWith('Patient created successfully');
  });

  it('should handle error when createPatient fails', () => {
    const patientData = {
      firstName: 'Test',
      lastName: 'Patient',
      fullName: 'Test Patient',
      dateOfBirth: '01/01/2000',
      genderOptions: '1',
      email: 'test@email.com',
      phoneNumber: '+1234567890',
      emergencyContact: '+1234567890',
      allergies: [],
      medicalConditions: ['None']
    };

    component.newPatient = patientData;

    const mockEvent = new Event('submit', {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(mockEvent, 'preventDefault', { value: jest.fn(), writable: true });

    const errorResponse = { error: 'Error creating patient' };
    patientServiceMock.createPatient.mockReturnValueOnce(throwError(errorResponse));

    component.createPatient(mockEvent);
    expect(patientServiceMock.createPatient).toHaveBeenCalledWith(patientData);
    expect(window.alert).toHaveBeenCalledWith('Error creating patient');
  });

  it('should clear the form after creating a patient', () => {
    component.newPatient = {
      firstName: 'Test',
      lastName: 'Patient',
      fullName: 'Test Patient',
      dateOfBirth: '01/01/2000',
      genderOptions: '1',
      email: 'test@email.com',
      phoneNumber: '+1234567890',
      emergencyContact: '+1234567890',
      allergies: ['None'],
      medicalConditions: ['None']
    };

    component.clearForm();

    expect(component.newPatient).toEqual({
      firstName: '',
      lastName: '',
      fullName: '',
      dateOfBirth: '',
      genderOptions: '',
      email: '',
      phoneNumber: '',
      emergencyContact: '',
      allergies: [],
      medicalConditions: []
    });
  });
});
