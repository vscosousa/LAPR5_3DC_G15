import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UpdateConditionsComponent } from './update-conditions.component';
import { MedicalConditionService } from '../../../Services/medical-condition.service';

describe('UpdateConditionsComponent', () => {
  let component: UpdateConditionsComponent;
  let fixture: ComponentFixture<UpdateConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UpdateConditionsComponent], // Import the standalone component and HttpClientTestingModule
      providers: [MedicalConditionService] // Provide the ConditionService
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should update', () => {
    expect(component).toBeTruthy();
  });
});
