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
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

import { OperationTypesComponent } from './operation-types.component';

describe('OperationTypesComponent', () => {
  let component: OperationTypesComponent;
  let fixture: ComponentFixture<OperationTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OperationTypesComponent,
        HttpClientModule // Add HttpClientModule to imports
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}) // Mock any required parameters here
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});