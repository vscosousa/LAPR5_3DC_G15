import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PatientPanelComponent } from './patient-panel.component';

describe('PatientPanelComponent', () => {
  let component: PatientPanelComponent;
  let fixture: ComponentFixture<PatientPanelComponent>;

  beforeEach(async () => {
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

    fixture = TestBed.createComponent(PatientPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
