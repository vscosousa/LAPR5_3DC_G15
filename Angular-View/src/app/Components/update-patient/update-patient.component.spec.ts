import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

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
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
        emergencyContact: 'Jane Doe',
        medicalConditions: 'None'
      }])),
      updatePatient: jasmine.createSpy('updatePatient').and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, HttpClientTestingModule, UpdatePatientComponent, SidebarComponent],
      providers: [
        { provide: PatientService, useValue: mockPatientService }
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

    fixture = TestBed.createComponent(UpdatePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
