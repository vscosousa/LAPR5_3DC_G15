import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UpdateAllergiesComponent } from './update-allergies.component';
import { AllergyService } from '../../../Services/allergy.service';
import { of, throwError } from 'rxjs';

describe('UpdateAllergiesComponent', () => {
  let component: UpdateAllergiesComponent;
  let fixture: ComponentFixture<UpdateAllergiesComponent>;
  let allergyService: AllergyService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UpdateAllergiesComponent], // Import the standalone component and HttpClientTestingModule
      providers: [AllergyService] // Provide the AllergyService
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateAllergiesComponent);
    component = fixture.componentInstance;
    allergyService = TestBed.inject(AllergyService);
    component.allergy = { id: 'A123', allergyCode: 'A123', allergyName: 'Peanuts' }; // Provide necessary input data
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update allergy successfully', () => {
    spyOn(allergyService, 'updateAllergy').and.returnValue(of({}));
    spyOn(window, 'alert');
    spyOn(component.allergyUpdated, 'emit');

    component.onSubmit();

    expect(allergyService.updateAllergy).toHaveBeenCalledWith('A123', component.allergy);
    expect(window.alert).toHaveBeenCalledWith('Allergy updated successfully!');
    expect(component.allergyUpdated.emit).toHaveBeenCalled();
  });

  it('should handle error while updating allergy', () => {
    spyOn(allergyService, 'updateAllergy').and.returnValue(throwError('Error'));
    spyOn(window, 'alert');
    spyOn(console, 'error');

    component.onSubmit();

    expect(allergyService.updateAllergy).toHaveBeenCalledWith('A123', component.allergy);
    expect(console.error).toHaveBeenCalledWith('Error updating allergy:', 'Error');
    expect(window.alert).toHaveBeenCalledWith('Failed to update allergy.');
  });
});
