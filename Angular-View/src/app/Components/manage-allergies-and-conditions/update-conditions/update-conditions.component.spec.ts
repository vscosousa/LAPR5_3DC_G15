/**
   * @fileoverview Unit tests for the UpdateConditionsComponent.
   * @author Vasco Sousa (1221700)
   * @date 11/12/2024
   * 
   * This file contains the unit tests for the UpdateConditionsComponent.
   * 
   * Methods implemented:
   * - beforeEach: Sets up the testing environment before each test.
   * - it: Contains individual test cases for the component.
   */

  /**
   * Fixture for the UpdateConditionsComponent.
   * Used to create an instance of the component and access its properties and methods.
   */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UpdateConditionsComponent } from './update-conditions.component';
import { MedicalConditionService } from '../../../Services/medical-condition.service';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('UpdateConditionsComponent', () => {
  let component: UpdateConditionsComponent;
  let fixture: ComponentFixture<UpdateConditionsComponent>;
  let mockMedicalConditionService: any;

  beforeEach(async () => {
    mockMedicalConditionService = {
      updateCondition: jasmine.createSpy('updateCondition').and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, UpdateConditionsComponent], // Import the standalone component, HttpClientTestingModule, and FormsModule
      providers: [
        { provide: MedicalConditionService, useValue: mockMedicalConditionService } // Provide the mock MedicalConditionService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateConditionsComponent);
    component = fixture.componentInstance;
    component.medicalCondition = { id: 'C123', medicalConditionCode: 'C123', medicalConditionName: 'Asthma' }; // Provide necessary input data
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update condition successfully', () => {
    spyOn(component.conditionUpdated, 'emit');
    spyOn(window, 'alert'); // Mock window.alert

    component.onSubmit();

    expect(mockMedicalConditionService.updateCondition).toHaveBeenCalledWith('C123', component.medicalCondition);
    expect(window.alert).toHaveBeenCalledWith('Condition updated successfully!');
    expect(component.conditionUpdated.emit).toHaveBeenCalled();
  });

  it('should handle error when updating condition fails', () => {
    mockMedicalConditionService.updateCondition.and.returnValue(throwError({ error: 'Update failed' }));
    spyOn(window, 'alert'); // Mock window.alert

    component.onSubmit();

    expect(mockMedicalConditionService.updateCondition).toHaveBeenCalledWith('C123', component.medicalCondition);
    expect(window.alert).toHaveBeenCalledWith('Failed to update condition.');
  });
});
