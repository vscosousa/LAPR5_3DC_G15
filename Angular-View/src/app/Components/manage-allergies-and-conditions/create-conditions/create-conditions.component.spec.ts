import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreateConditionsComponent } from './create-conditions.component';
import { MedicalConditionService } from '../../../Services/medical-condition.service';

describe('CreateConditionsComponent', () => {
  let component: CreateConditionsComponent;
  let fixture: ComponentFixture<CreateConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CreateConditionsComponent], // Import the standalone component and HttpClientTestingModule
      providers: [MedicalConditionService] // Provide the MedicalConditionService
    }).compileComponents();

    fixture = TestBed.createComponent(CreateConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
