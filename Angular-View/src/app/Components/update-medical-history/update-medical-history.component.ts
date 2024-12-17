import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AllergyService } from '../../Services/allergy.service';
import { MedicalConditionService } from '../../Services/medical-condition.service';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { PanelService } from '../../Services/panel.service';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { MedicalHistoryService } from '../../Services/medical-history.service'; // Import MedicalHistoryService

@Component({
  selector: 'app-update-medical-history',
  standalone: true,
  imports: [FormsModule, CommonModule, SidebarComponent],
  templateUrl: './update-medical-history.component.html',
  styleUrls: ['./update-medical-history.component.scss']
})

export class UpdateMedicalHistoryComponent implements OnInit {
  medicalHistory: {
    id: string;
    patientMedicalRecordNumber: string;
    allergies: string[];
    medicalConditions: string[];
    familyHistory: string[];
    freeText: string;
  } = {
      id: '',
      patientMedicalRecordNumber: '',
      allergies: [],
      medicalConditions: [],
      familyHistory: [],
      freeText: ''
    };

  newFamilyHistory: { relationship: string; conditions: string[] } = { relationship: '', conditions: [] };
  selectedFamilyHistory: number | null = null;

  filters: any = {};
  patients: { medicalRecordNumber: string; fullName: string; }[] = [];
  selectedPatient: { medicalRecordNumber: string; fullName: string; dateOfBirth: string; email: string; emergencyContact: string; firstName: string; gender: number; id: string; isActive: boolean; lastName: string; medicalHistory: string; phoneNumber: string; appointmentHistory: any[] } | undefined;
  allergies: { id: string; allergyName: string; }[] = [];
  medicalConditions: { id: string; medicalConditionName: string; }[] = [];
  selectedAllergies: { id: string; allergyName: string; }[] = [];
  selectedMedicalConditions: { id: string; medicalConditionName: string; }[] = [];
  selectedMedicalHistory: { id: string, patientMedicalRecordNumber: string, medicalConditions: string[], allergies: string[], freeText: string, familyHistory: string[] } | undefined;
  allergySearch: string = '';
  medicalConditionSearch: string = '';
  filteredAllergies: { id: string; allergyName: string; }[] = [];
  filteredMedicalConditions: { id: string; medicalConditionName: string; }[] = [];
  isMedicalHistoryModalOpen: boolean = false;

  showUpdateFamilyHistoryModal = false;
  showFamilyConditionsModal = false;
  wasUpdateFamilyHistoryModalOpen = false;

  constructor(
    private allergyService: AllergyService,
    private panelService: PanelService,
    private medicalHistoryService: MedicalHistoryService,
    private medicalConditionService: MedicalConditionService,
  ) { }

  ngOnInit() {
    console.log('ngOnInit called');
    this.panelService.setPanelId('panel-admin');
    this.fetchAllergies();
    this.fetchMedicalConditions();
    const medicalRecordNumber = this.extractMedicalRecordNumberFromUrl();
    this.fetchMedicalHistory(medicalRecordNumber);
  }

  fetchMedicalHistory(medicalRecordNumber: string): void {
    console.log('fetchMedicalHistory called with medicalRecordNumber:', medicalRecordNumber);
    this.medicalHistoryService.getPatientMedicalHistory(medicalRecordNumber).subscribe(
      (response: any) => {
        if (response) {
          this.medicalHistory = {
            id: response.id,
            patientMedicalRecordNumber: response.patientMedicalRecordNumber,
            medicalConditions: response.medicalConditions ? response.medicalConditions.split(',') : [],
            allergies: response.allergies ? response.allergies.split(',') : [],
            freeText: response.freeText,
            familyHistory: Array.isArray(response.familyHistory) ? response.familyHistory : this.parseFamilyHistoryString(response.familyHistory)
          };
          console.log('Medical history fetched:', this.medicalHistory);
          this.filterSelectedAllergies();
          this.filterSelectedMedicalConditions();
        } else {
          console.error('Failed to fetch medical history');
        }
      },
      error => {
        if (error.status === 404) {
          this.selectedMedicalHistory = undefined;
          this.selectedAllergies = [];
          this.selectedMedicalConditions = [];
          this.filteredAllergies = [];
          this.filteredMedicalConditions = [];
          console.error('Medical history not found (404)');
        } else {
          console.error('Error fetching medical history', error);
        }
      }
    );
  }

  parseFamilyHistoryString(familyHistoryString: string): string[] {
    return familyHistoryString
      .split(/,(?=\s*[A-Za-z]+:)/) // Split entries by comma followed by a relationship
      .map(entry => entry.trim()); // Trim each entry
  }


  parseFamilyHistory(familyHistory: string[]): { relationship: string; conditions: string[] }[] {
    return familyHistory.map(entry => {
      // Split the entry into relationship and conditions
      const [relationship, conditionsString] = entry.split(': ');

      if (!conditionsString) {
        return { relationship, conditions: [] };
      }

      // Split conditions by semicolons, handling commas inside condition names
      const conditions = conditionsString
        .split(';') // Split by semicolons
        .map(cond => cond.trim()) // Trim each condition
        .filter(cond => cond.length > 0); // Exclude empty conditions

      return {
        relationship: relationship.trim(),
        conditions,
      };
    });
  }


  filterSelectedAllergies(): void {
    console.log('filterSelectedAllergies called');
    if (this.selectedMedicalHistory) {
      this.selectedAllergies = this.allergies
        .filter(allergy => this.selectedMedicalHistory!.allergies.includes(allergy.id));
      this.filteredAllergies = this.selectedAllergies;
      console.log('Filtered allergies:', this.selectedAllergies);
    }
  }

  filterSelectedMedicalConditions(): void {
    console.log('filterSelectedMedicalConditions called');
    if (this.selectedMedicalHistory) {
      this.selectedMedicalConditions = this.medicalConditions
        .filter(condition => this.selectedMedicalHistory!.medicalConditions.includes(condition.id));
      this.filteredMedicalConditions = this.selectedMedicalConditions;
      console.log('Filtered medical conditions:', this.selectedMedicalConditions);
    }
  }

  searchAllergies(): void {
    console.log('searchAllergies called with allergySearch:', this.allergySearch);
    this.filteredAllergies = this.selectedAllergies.filter(allergy =>
      allergy.allergyName.toLowerCase().includes(this.allergySearch.toLowerCase())
    );
    console.log('Filtered allergies after search:', this.filteredAllergies);
  }

  searchMedicalConditions(): void {
    console.log('searchMedicalConditions called with medicalConditionSearch:', this.medicalConditionSearch);
    this.filteredMedicalConditions = this.selectedMedicalConditions.filter(condition =>
      condition.medicalConditionName.toLowerCase().includes(this.medicalConditionSearch.toLowerCase())
    );
    console.log('Filtered medical conditions after search:', this.filteredMedicalConditions);
  }

  extractMedicalRecordNumberFromUrl() {
    console.log('extractMedicalRecordNumberFromUrl called');
    const url = window.location.href;
    const regex = /\/update-medical-history\/(\d+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      console.log('Medical record number extracted from URL:', match[1]);
      return match[1];
    } else {
      throw new Error('Medical record number not found in URL.');
    }
  }

  fetchAllergies(): void {
    console.log('fetchAllergies called');
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

  fetchMedicalConditions(): void {
    console.log('fetchMedicalConditions called');
    this.medicalConditionService.getMedicalConditions().subscribe(
      (response: any) => {
          this.medicalConditions = response;
          console.log('Medical conditions fetched:', this.medicalConditions);
      },
      error => {
        console.error('Error fetching medical conditions', error);
      }
    );
  }

  onAllergyChange(event: any, allergyId: string) {
    console.log('onAllergyChange called with event:', event, 'and allergyId:', allergyId);
    if (event.target.checked) {
      this.medicalHistory.allergies.push(allergyId);
    } else {
      const index = this.medicalHistory.allergies.indexOf(allergyId);
      if (index > -1) {
        this.medicalHistory.allergies.splice(index, 1);
      }
    }
    console.log('Updated allergies:', this.medicalHistory.allergies);
  }

  onMedicalConditionChange(event: any, medicalConditionId: string) {
    console.log('onMedicalConditionChange called with event:', event, 'and medicalConditionId:', medicalConditionId);
    if (event.target.checked) {
      this.medicalHistory.medicalConditions.push(medicalConditionId);
    } else {
      const index = this.medicalHistory.medicalConditions.indexOf(medicalConditionId);
      if (index > -1) {
        this.medicalHistory.medicalConditions.splice(index, 1);
      }
    }
    console.log('Updated medical conditions:', this.medicalHistory.medicalConditions);
  }

  openFamilyConditionsModal() {
    console.log('openFamilyConditionsModal called');
    this.wasUpdateFamilyHistoryModalOpen = this.showUpdateFamilyHistoryModal;
    this.showUpdateFamilyHistoryModal = false; // Ensure the update modal is closed
    this.showFamilyConditionsModal = true;
    console.log('Family conditions modal opened');
  }

  closeFamilyConditionsModal() {
    console.log('closeFamilyConditionsModal called');
    this.showFamilyConditionsModal = false;
    if (this.wasUpdateFamilyHistoryModalOpen) {
      this.showUpdateFamilyHistoryModal = true; // Reopen the update modal if it was previously open
    }
    console.log('Family conditions modal closed');
  }

  addFamilyHistory() {
    console.log('addFamilyHistory called with newFamilyHistory:', this.newFamilyHistory);

    // Format conditions by joining with a semicolon
    const formattedConditions = this.newFamilyHistory.conditions.join('; ');

    const familyHistoryString = `${this.newFamilyHistory.relationship}: ${formattedConditions}`;
    if (!this.medicalHistory.familyHistory.includes(familyHistoryString)) {
      this.medicalHistory.familyHistory.push(familyHistoryString);
    }

    this.newFamilyHistory = { relationship: '', conditions: [] }; // Reset form
    console.log('Updated family history:', this.medicalHistory.familyHistory);
  }

  removeFamilyHistory(index: number) {
    console.log('removeFamilyHistory called with index:', index);
    this.medicalHistory.familyHistory.splice(index, 1);
    this.selectedFamilyHistory = null;
    console.log('Updated family history:', this.medicalHistory.familyHistory);
  }

  onFamilyHistoryConditionChange(event: any, condition: string) {
    console.log('onFamilyHistoryConditionChange called with event:', event, 'and condition:', condition);
    if (event.target.checked) {
      if (!this.newFamilyHistory.conditions.includes(condition)) {
        this.newFamilyHistory.conditions.push(condition);
      }
    } else {
      const index = this.newFamilyHistory.conditions.indexOf(condition);
      if (index > -1) {
        this.newFamilyHistory.conditions.splice(index, 1);
      }
    }
    console.log('Updated new family history conditions:', this.newFamilyHistory.conditions);
  }

  editFamilyHistory(index: number) {
    console.log('editFamilyHistory called with index:', index);
    this.selectedFamilyHistory = index;
    const familyHistoryEntry = this.parseFamilyHistory([this.medicalHistory.familyHistory[index]])[0];
    this.newFamilyHistory = {
      relationship: familyHistoryEntry.relationship,
      conditions: familyHistoryEntry.conditions,
    };
    this.showUpdateFamilyHistoryModal = true;
    console.log('Editing family history:', this.newFamilyHistory);
  }


  closeUpdateFamilyHistoryModal() {
    console.log('closeUpdateFamilyHistoryModal called');
    this.showUpdateFamilyHistoryModal = false;
    this.newFamilyHistory = { relationship: '', conditions: [] };
    console.log('Update family history modal closed');
  }

  updateFamilyHistory() {
    console.log('updateFamilyHistory called');
    if (this.selectedFamilyHistory !== null) {
      // Join conditions with a semicolon for the updated entry
      const familyHistoryString = `${this.newFamilyHistory.relationship}: ${this.newFamilyHistory.conditions.join('; ')}`;
      if (!this.medicalHistory.familyHistory.includes(familyHistoryString)) {
        this.medicalHistory.familyHistory[this.selectedFamilyHistory] = familyHistoryString;
      }
      this.closeUpdateFamilyHistoryModal();
      console.log('Updated family history:', this.medicalHistory.familyHistory);
    }
  }

  submitMedicalHistory() {
    console.log('submitMedicalHistory called with medicalHistory:', this.medicalHistory);

    this.medicalHistoryService.updatePatientMedicalHistory(
      this.medicalHistory.patientMedicalRecordNumber,
      this.medicalHistory.allergies,
      this.medicalHistory.medicalConditions,
      this.medicalHistory.familyHistory,
      this.medicalHistory.freeText
    ).subscribe(
      (response: any) => {
        console.log('Medical history updated:', response);
        alert('Medical history updated successfully');
      },
      (error: any) => {
        console.error('Error updating medical history:', error);
        alert('Error updating medical history');
      }
    );
  }

}
