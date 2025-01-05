/**
 * @file manage-allergies-and-conditions.component.ts
 * @description Component for managing allergies and medical conditions.
 * @date 11/12/2024
 * @author Vasco Sousa (1221700)
 */

import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { PanelService } from '../../Services/panel.service';
import { AllergyService } from '../../Services/allergy.service';
import { MedicalConditionService } from '../../Services/medical-condition.service';
import { CreateAllergiesComponent } from "./create-allergies/create-allergies.component";
import { CreateConditionsComponent } from "./create-conditions/create-conditions.component";
import { UpdateAllergiesComponent } from "./update-allergies/update-allergies.component";
import { UpdateConditionsComponent } from "./update-conditions/update-conditions.component";



/**
 * @class ManageAllergiesAndConditionsComponent
 * @description Component class for managing allergies and medical conditions.
 */
@Component({
  selector: 'app-manage-allergies-and-conditions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarComponent, CreateAllergiesComponent, CreateConditionsComponent, UpdateAllergiesComponent, UpdateConditionsComponent],
  templateUrl: './manage-allergies-and-conditions.component.html',
  styleUrls: ['./manage-allergies-and-conditions.component.scss']
})
export class ManageAllergiesAndConditionsComponent {
  modalType: string | null = null;
  allergies: { code: string; allergyName: string; description: string; symptoms: string; }[] = [];
  medicalConditions: { code: string; medicalConditionName: string; description: string; symptoms: string; }[] = [];
  selectedItem: any = null;
  selectedItemType: string | null = null;

  /**
   * @constructor
   * @param renderer Renderer2 service for manipulating DOM elements.
   * @param router Router service for navigation.
   * @param panelService PanelService for managing panel state.
   * @param allergyService AllergyService for fetching allergy data.
   * @param medicalConditionService MedicalConditionService for fetching medical condition data.
   */
  constructor(private renderer: Renderer2, private router: Router, private panelService: PanelService, private allergyService: AllergyService,
    private medicalConditionService: MedicalConditionService) { }

  /**
   * @method ngOnInit
   * @description Lifecycle hook that is called after data-bound properties are initialized.
   */
  ngOnInit(): void {
    this.panelService.setPanelId('panel-admin');
    this.fetchAllergies();
    this.fetchMedicalConditions();
  }

  /**
   * @method openModal
   * @description Opens a modal of the specified type.
   * @param type The type of modal to open.
   */
  openModal(type: string): void {
    this.modalType = type;
    this.renderer.addClass(document.body, 'modal-active');
    this.router.navigate([`/manage-allergies-and-conditions/${type}`]);
  }

  /**
   * @method closeModal
   * @description Closes the currently open modal.
   */
  closeModal(): void {
    this.modalType = null;
    this.selectedItem = null;
    this.selectedItemType = null;
    this.renderer.removeClass(document.body, 'modal-active');
    this.router.navigate(['/manage-allergies-and-conditions']);
    this.refreshPage();
  }

  /**
   * @method openDetailsModal
   * @description Opens a details modal for the specified item.
   * @param item The item to display details for.
   * @param itemType The type of the item (allergy or medical condition).
   */
  openDetailsModal(item: any, itemType: string): void {
    this.selectedItem = item;
    this.selectedItemType = itemType;
    this.modalType = 'details';
    this.renderer.addClass(document.body, 'modal-active');
  }

  /**
   * @method openUpdateModal
   * @description Opens an update modal for the specified item.
   * @param item The item to update.
   * @param itemType The type of the item (allergy or medical condition).
   */
  openUpdateModal(item: any, itemType: string): void {
    this.selectedItem = item;
    this.selectedItemType = itemType;
    this.modalType = itemType === 'allergy' ? 'update-allergies' : 'update-conditions';
    this.renderer.addClass(document.body, 'modal-active');
    if (itemType === 'allergy') {
      this.router.navigate([`/manage-allergies-and-conditions/update-allergies/${item.id}`]);
    } else {
      this.router.navigate([`/manage-allergies-and-conditions/update-conditions/${item.id}`]);
    }
  }

  /**
   * @method handleAllergyCreated
   * @description Handles the event when an allergy is created.
   */
  handleAllergyCreated(): void {
    this.closeModal();
  }

  /**
   * @method handleConditionCreated
   * @description Handles the event when a medical condition is created.
   */
  handleConditionCreated(): void {
    this.closeModal();
  }

  /**
   * @method handleAllergyUpdated
   * @description Handles the event when an allergy is updated.
   */
  handleAllergyUpdated(): void {
    this.closeModal();
  }

  /**
   * @method handleConditionUpdated
   * @description Handles the event when a medical condition is updated.
   */
  handleConditionUpdated(): void {
    this.closeModal();
  }

  /**
   * @method refreshPage
   * @description Refreshes the page by fetching the latest allergies and medical conditions.
   */
  refreshPage(): void {
    this.fetchAllergies();
    this.fetchMedicalConditions();
  }

  /**
   * @method fetchAllergies
   * @description Fetches the list of allergies from the server.
   */
  fetchAllergies(): void {
    this.allergyService.getAllergies().subscribe(
      (response: any) => {
        this.allergies = response;
        console.log('Allergies fetched:', this.allergies);
      },
      error => {
        console.error('Error fetching allergies', error);
      }
    );
  }

  /**
   * @method fetchMedicalConditions
   * @description Fetches the list of medical conditions from the server.
   */
  fetchMedicalConditions(): void {
    this.medicalConditionService.getMedicalConditions().subscribe(
      (response: any) => {
        this.medicalConditions = response;
        console.log('Medical Conditions fetched:', this.medicalConditions);
      },
      error => {
        console.error('Error fetching medical conditions', error);
      }
    );
  }
}
