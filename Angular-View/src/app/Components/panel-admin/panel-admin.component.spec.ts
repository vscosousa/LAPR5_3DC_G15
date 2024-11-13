import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PanelAdminComponent } from './panel-admin.component';

// Test suite for PanelAdminComponent
// Author: Vasco Sousa (1221700) and João Pereira (1211503)
// Last Updated: 12/11/2024

describe('PanelAdminComponent', () => {
  let component: PanelAdminComponent;
  let fixture: ComponentFixture<PanelAdminComponent>;

  beforeEach(async () => {
    // Set up the testing module for PanelAdminComponent
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PanelAdminComponent],
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
    fixture = TestBed.createComponent(PanelAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test to check if the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
