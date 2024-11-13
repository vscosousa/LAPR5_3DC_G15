import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ManagePatientsComponent } from './manage-patients.component';
import { PatientService } from '../../Services/patient.service';

describe('ManagePatientsComponent', () => {
  let component: ManagePatientsComponent;
  let fixture: ComponentFixture<ManagePatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ManagePatientsComponent],
      providers: [
        PatientService,
        { provide: ActivatedRoute, useValue: { params: of({}) } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
