import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreateAllergiesComponent } from './create-allergies.component';
import { AllergyService } from '../../../Services/allergy.service';

describe('CreateAllergiesComponent', () => {
  let component: CreateAllergiesComponent;
  let fixture: ComponentFixture<CreateAllergiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CreateAllergiesComponent], // Import the standalone component and HttpClientTestingModule
      providers: [AllergyService] // Provide the AllergyService
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAllergiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
