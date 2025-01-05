 /**
   * @description This file contains the unit tests for the CreateAllergiesComponent.
   * @date 09/12/2024
   * @author Vasco Sousa (1221700)
   * 
   * @class CreateAllergiesComponent
   * @description This class is responsible for testing the CreateAllergiesComponent.
   * 
   * @method beforeEach
   * @description Sets up the testing environment before each test.
   * 
   * @method it_should_create_the_component
   * @description Tests if the CreateAllergiesComponent is created successfully.
   * 
   * @method it_should_have_a_defined_fixture
   * @description Tests if the fixture for CreateAllergiesComponent is defined.
   */

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
