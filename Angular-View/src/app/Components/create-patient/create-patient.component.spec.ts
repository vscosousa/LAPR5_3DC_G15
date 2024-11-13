import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CreatePatientComponent } from './create-patient.component';
import { PatientService } from '../../Services/patient.service';

describe('CreatePatientComponent', () => {
  let component: CreatePatientComponent;
  let fixture: ComponentFixture<CreatePatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CreatePatientComponent],
      providers: [
        PatientService,
        { provide: ActivatedRoute, useValue: { params: of({}) } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
