import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PatientSettingsComponent } from './patient-settings.component';

// Test suite for PatientSettingsComponent
// Author: Vasco Sousa (1221700)
// Last Updated: 09/11/2024

describe('PatientSettingsComponent', () => {
  let component: PatientSettingsComponent;
  let fixture: ComponentFixture<PatientSettingsComponent>;

  beforeEach(async () => {
    // Set up the testing module for PatientSettingsComponent
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PatientSettingsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({})
          }
        }
      ]
    })
    .compileComponents();

    // Create the component and trigger change detection
    fixture = TestBed.createComponent(PatientSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test to check if the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
