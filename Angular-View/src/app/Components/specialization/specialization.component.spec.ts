/*
Author: João Pereira (1211503)
Last update: 06/12/2024
*/

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

import { SpecializationComponent } from './specialization.component';

describe('SpecializationComponent', () => {
  let component: SpecializationComponent;
  /**
   * Fixture for testing the SpecializationComponent.
   * Provides access to the component instance and allows interaction with the component's template.
   */
  let fixture: ComponentFixture<SpecializationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SpecializationComponent,
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

    fixture = TestBed.createComponent(SpecializationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});