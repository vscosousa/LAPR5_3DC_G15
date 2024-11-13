import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CreatePatientComponent } from './create-patient.component';
import { PatientService } from '../../Services/patient.service';

// Test suite for CreatePatientComponent
// Author: Vasco Sousa (1221700)
// Last Updated: 12/11/2024

describe('CreatePatientComponent', () => {
  let component: CreatePatientComponent;
  let fixture: ComponentFixture<CreatePatientComponent>;

  beforeEach(async () => {
    // Set up the testing module for CreatePatientComponent
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CreatePatientComponent],
      providers: [
        PatientService,
        { provide: ActivatedRoute, useValue: { params: of({}) } }
      ]
    })
    .compileComponents();

    // Create the component and trigger change detection
    fixture = TestBed.createComponent(CreatePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test to check if the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
