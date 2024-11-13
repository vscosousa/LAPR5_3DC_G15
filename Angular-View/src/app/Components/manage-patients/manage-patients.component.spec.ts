import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ManagePatientsComponent } from './manage-patients.component';
import { PatientService } from '../../Services/patient.service';

// Test suite for ManagePatientsComponent
// Author: Vasco Sousa (1221700)
// Last Updated: 12/11/2024

describe('ManagePatientsComponent', () => {
  let component: ManagePatientsComponent;
  let fixture: ComponentFixture<ManagePatientsComponent>;

  beforeEach(async () => {
    // Set up the testing module for ManagePatientsComponent
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ManagePatientsComponent],
      providers: [
        PatientService,
        { provide: ActivatedRoute, useValue: { params: of({}) } }
      ]
    })
    .compileComponents();

    // Create the component and trigger change detection
    fixture = TestBed.createComponent(ManagePatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test to check if the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
