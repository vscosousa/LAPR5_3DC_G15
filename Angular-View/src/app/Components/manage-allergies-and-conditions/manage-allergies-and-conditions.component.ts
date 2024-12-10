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

@Component({
  selector: 'app-manage-allergies-and-conditions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarComponent, CreateAllergiesComponent, CreateConditionsComponent],
  templateUrl: './manage-allergies-and-conditions.component.html',
  styleUrls: ['./manage-allergies-and-conditions.component.scss']
})
export class ManageAllergiesAndConditionsComponent {
  modalType: string | null = null;
  allergies: { allergyName: string; }[] = [];
  medicalConditions: { medicalConditionName: string; }[] = [];

  constructor(private renderer: Renderer2, private router: Router, private panelService: PanelService, private allergyService: AllergyService,
    private medicalConditionService: MedicalConditionService) {}

  ngOnInit(): void {
    this.panelService.setPanelId('panel-admin');
    this.fetchAllergies();
    this.fetchMedicalConditions();
  }

  openModal(type: string): void {
    this.modalType = type;
    this.renderer.addClass(document.body, 'modal-active');
    this.router.navigate([`/manage-allergies-and-conditions/${type}`]);
  }

  closeModal(): void {
    this.modalType = null;
    this.renderer.removeClass(document.body, 'modal-active');
    this.router.navigate(['/manage-allergies-and-conditions']);
    this.refreshPage();
  }

  closeModalOnOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal')) {
      this.closeModal();
    }
  }

  handleAllergyCreated(): void {
    this.closeModal();
  }

  handleConditionCreated(): void {
    this.closeModal();
  }

  refreshPage(): void {
    this.fetchAllergies();
    this.fetchMedicalConditions();
  }

  fetchAllergies(): void {
    this.allergyService.getAllergies().subscribe(
      (response: any) => {
        if (response.isSuccess && response._value) {
          this.allergies = response._value;
          console.log('Allergies fetched:', this.allergies);
        } else {
          console.error('Failed to fetch allergies:', response.error);
        }
      },
      error => {
        console.error('Error fetching allergies', error);
      }
    );
  }

  fetchMedicalConditions(): void {
    this.medicalConditionService.getMedicalConditions().subscribe(
      (response: any) => {
        if (response.isSuccess && response._value) {
          this.medicalConditions = response._value;
          console.log('Medical Conditions fetched:', this.medicalConditions);
        } else {
          console.error('Failed to fetch medical conditions:', response.error);
        }
      },
      error => {
        console.error('Error fetching medical conditions', error);
      }
    );
  }
}
