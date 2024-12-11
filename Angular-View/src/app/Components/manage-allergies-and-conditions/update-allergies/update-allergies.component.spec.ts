import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UpdateAllergiesComponent } from './update-allergies.component';
import { AllergyService } from '../../../Services/allergy.service';

describe('UpdateAllergiesComponent', () => {
  let component: UpdateAllergiesComponent;
  let fixture: ComponentFixture<UpdateAllergiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UpdateAllergiesComponent], // Import the standalone component and HttpClientTestingModule
      providers: [AllergyService] // Provide the AllergyService
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateAllergiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should update', () => {
    expect(component).toBeTruthy();
  });
});
