import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ManageAllergiesAndConditionsComponent } from './manage-allergies-and-conditions.component';
import { AllergyService } from '../../Services/allergy.service';
import { MedicalConditionService } from '../../Services/medical-condition.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ManageAllergiesAndConditionsComponent', () => {
  let component: ManageAllergiesAndConditionsComponent;
  let fixture: ComponentFixture<ManageAllergiesAndConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ManageAllergiesAndConditionsComponent], // Import the standalone component
      providers: [
        AllergyService,
        MedicalConditionService,
        { provide: ActivatedRoute, useValue: { params: of({ id: '123' }) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageAllergiesAndConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
