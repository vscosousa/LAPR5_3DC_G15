/**
     * @file manage-allergies-and-conditions.component.spec.ts
     * @description This file contains the unit tests for the ManageAllergiesAndConditionsComponent.
     * @author Vasco Sousa (1221700)
     * @date 11/12/2024
**/


  

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ManageAllergiesAndConditionsComponent } from './manage-allergies-and-conditions.component';
import { AllergyService } from '../../Services/allergy.service';
import { MedicalConditionService } from '../../Services/medical-condition.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Renderer2 } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { PanelService } from '../../Services/panel.service';

describe('ManageAllergiesAndConditionsComponent', () => {
  let component: ManageAllergiesAndConditionsComponent;
  let fixture: ComponentFixture<ManageAllergiesAndConditionsComponent>;
  let allergyService: AllergyService;
  let medicalConditionService: MedicalConditionService;
  let renderer: Renderer2;
  let panelService: PanelService;

  beforeEach(async () => {
    const rendererMock = {
      addClass: jest.fn(),
      removeClass: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ManageAllergiesAndConditionsComponent], // Import the necessary modules
      providers: [
        AllergyService,
        MedicalConditionService,
        { provide: Renderer2, useValue: rendererMock },
        PanelService,
        { provide: ActivatedRoute, useValue: { params: of({ id: '123' }) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageAllergiesAndConditionsComponent);
    component = fixture.componentInstance;
    allergyService = TestBed.inject(AllergyService);
    medicalConditionService = TestBed.inject(MedicalConditionService);
    renderer = TestBed.inject(Renderer2);
    panelService = TestBed.inject(PanelService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch allergies on init', () => {
    jest.spyOn(component, 'fetchAllergies');
    component.ngOnInit();
    expect(component.fetchAllergies).toHaveBeenCalled();
  });

  it('should fetch medical conditions on init', () => {
    jest.spyOn(component, 'fetchMedicalConditions');
    component.ngOnInit();
    expect(component.fetchMedicalConditions).toHaveBeenCalled();
  });

  it('should open modal and navigate to the correct route', () => {
    jest.spyOn(component['router'], 'navigate');

    component.openModal('create-allergies');

    expect(component.modalType).toBe('create-allergies');
    expect(component['router'].navigate).toHaveBeenCalledWith(['/manage-allergies-and-conditions/create-allergies']);
  });

  it('should close modal and reset state', () => {
    jest.spyOn(component['router'], 'navigate');
    jest.spyOn(component, 'refreshPage');

    component.closeModal();

    expect(component.modalType).toBeNull();
    expect(component.selectedItem).toBeNull();
    expect(component.selectedItemType).toBeNull();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/manage-allergies-and-conditions']);
    expect(component.refreshPage).toHaveBeenCalled();
  });

  it('should fetch allergies successfully', async () => {
      const mockAllergies = [{ code: 'A1', allergyName: 'Peanuts', description: 'Allergy to peanuts', symptoms: 'Swelling' }];
      jest.spyOn(allergyService, 'getAllergies').mockReturnValue(of(mockAllergies as any));

      component.fetchAllergies();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(allergyService.getAllergies).toHaveBeenCalled();
      expect(component.allergies).toEqual(mockAllergies);
  });

  it('should handle error while fetching allergies', () => {
    jest.spyOn(allergyService, 'getAllergies').mockReturnValue(throwError('Error'));
    jest.spyOn(console, 'error').mockImplementation(() => {});

    component.fetchAllergies();

    expect(allergyService.getAllergies).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error fetching allergies', 'Error');
  });

  it('should fetch medical conditions successfully', async () => {
    
    const mockConditions = [{ code: 'C1', medicalConditionName: 'Asthma', description: 'Asthma condition', symptoms: 'Shortness of breath' }] ;
    jest.spyOn(medicalConditionService, 'getMedicalConditions').mockReturnValue(of(mockConditions as any));

    component.fetchMedicalConditions();
    await fixture.whenStable(); // Wait for async operations to complete
    fixture.detectChanges(); // Update the component's state

    expect(medicalConditionService.getMedicalConditions).toHaveBeenCalled();
    expect(component.medicalConditions).toEqual(mockConditions);
  });

  it('should handle error while fetching medical conditions', () => {
    jest.spyOn(medicalConditionService, 'getMedicalConditions').mockReturnValue(throwError('Error'));
    jest.spyOn(console, 'error').mockImplementation(() => {});

    component.fetchMedicalConditions();

    expect(medicalConditionService.getMedicalConditions).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error fetching medical conditions', 'Error');
  });

  it('should handle allergy created event', () => {
    jest.spyOn(component, 'closeModal');
    component.handleAllergyCreated();
    expect(component.closeModal).toHaveBeenCalled();
  });

  it('should handle condition created event', () => {
    jest.spyOn(component, 'closeModal');
    component.handleConditionCreated();
    expect(component.closeModal).toHaveBeenCalled();
  });

  it('should handle allergy updated event', () => {
    jest.spyOn(component, 'closeModal');
    component.handleAllergyUpdated();
    expect(component.closeModal).toHaveBeenCalled();
  });

  it('should handle condition updated event', () => {
    jest.spyOn(component, 'closeModal');
    component.handleConditionUpdated();
    expect(component.closeModal).toHaveBeenCalled();
  });

  it('should refresh page by fetching allergies and medical conditions', () => {
    jest.spyOn(component, 'fetchAllergies');
    jest.spyOn(component, 'fetchMedicalConditions');

    component.refreshPage();

    expect(component.fetchAllergies).toHaveBeenCalled();
    expect(component.fetchMedicalConditions).toHaveBeenCalled();
  });
});
