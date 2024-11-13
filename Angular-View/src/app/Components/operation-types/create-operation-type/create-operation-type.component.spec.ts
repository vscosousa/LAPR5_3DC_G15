/**
 * US 6.2.18 - As an admin, I want to create a new operation type
 * US Developed By: João Pereira - 1211503
 * Finished at 11/11/2024
 *
 * Test suite for the CreateOperationTypeComponent.
 * 
 * @testSuite
 * @class CreateOperationTypeComponentTest
 * 
 * @method beforeEach Sets up the test environment for each test.
 * @method it('should create') Tests if the component is created successfully.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { CreateOperationTypeComponent } from './create-operation-type.component';
import { OperationTypeService } from '../../../Services/operation-type.service'; // Import the service

describe('CreateOperationTypeComponent', () => {
  let component: CreateOperationTypeComponent;
  let fixture: ComponentFixture<CreateOperationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreateOperationTypeComponent,
        HttpClientModule // Add HttpClientModule here
      ],
      providers: [
        OperationTypeService, // Provide the service
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({})
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOperationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});