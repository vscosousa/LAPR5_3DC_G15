  /**
   * @fileoverview This file contains the unit tests for the CreateConditionsComponent.
   * 
   * @author Vasco Sousa (1221700)
   * @date 09/12/2024
   * 
   * @description
   * This file includes the setup and tests for the CreateConditionsComponent.
   * 
   * @methods
   * - beforeEach: Sets up the testing environment before each test.
   * - it('should create'): Tests if the component is created successfully.
   */

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
