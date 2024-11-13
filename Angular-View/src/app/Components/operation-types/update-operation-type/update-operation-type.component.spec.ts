/**
 * US 6.2.21 - As an admin, I want to view all operation types
 * US Developed By: João Pereira - 1211503
 * Finished at 11/11/2024
 *
 * Test suite for the OperationTypesComponent.
 * 
 * @testSuite
 * @class OperationTypesComponentTest
 * 
 * @method beforeEach Sets up the test environment for each test.
 * @method it('should create') Tests if the component is created successfully.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateOperationTypeComponent } from './update-operation-type.component';
import { OperationTypeService } from '../../../Services/operation-type.service';

describe('UpdateOperationTypeComponent', () => {
  let component: UpdateOperationTypeComponent;
  let fixture: ComponentFixture<UpdateOperationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ReactiveFormsModule,
        UpdateOperationTypeComponent
      ],
      providers: [
        OperationTypeService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (name: string) => 'Cardiology Operation'
              }
            }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateOperationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});