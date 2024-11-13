import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PatientPanelComponent } from './patient-panel.component';

// Test suite for PatientPanelComponent
// Author: Vasco Sousa (1221700)
// Last Updated: 09/11/2024

describe('PatientPanelComponent', () => {
  let component: PatientPanelComponent;
  let fixture: ComponentFixture<PatientPanelComponent>;

  beforeEach(async () => {
    // Set up the testing module for PatientPanelComponent
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PatientPanelComponent],
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
    fixture = TestBed.createComponent(PatientPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test to check if the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
