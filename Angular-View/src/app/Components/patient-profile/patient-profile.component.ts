/**
 * @fileoverview PatientProfileComponent handles the patient profile functionalities including fetching patient data, allergies, medical conditions, and medical history.
 * It also provides functionalities to download the profile data and verify a code for secure actions.
 * 
 * @author Vasco Sousa (1221700)
 * @date 22/12/2024
 * 
 * @class PatientProfileComponent
 * @implements OnInit
 * 
 * @method ngOnInit Initializes the component by setting panel and settings IDs, fetching allergies, medical conditions, and patient profile.
 * @method getPatientProfile Fetches the patient profile using the email decoded from the JWT token.
 * @method fetchAllergies Fetches all allergies from the allergy service.
 * @method fetchMedicalConditions Fetches all medical conditions from the medical condition service.
 * @method fetchMedicalHistory Fetches the medical history of the patient using the medical record number.
 * @method parseFamilyHistoryString Parses a family history string into an array of strings.
 * @method parseFamilyHistory Parses an array of family history strings into an array of objects with relationship and conditions.
 * @method filterSelectedAllergies Filters the selected allergies based on the fetched medical history.
 * @method filterSelectedMedicalConditions Filters the selected medical conditions based on the fetched medical history.
 * @method downloadProfile Downloads the patient profile data as a JSON file inside a ZIP archive.
 * @method openModal Opens a modal for code verification.
 * @method verifyCode Verifies the entered code and triggers the profile download if the code is correct.
 * @method closeModal Closes the modal.
 * @method moveFocus Moves the focus to the next input element when a digit is entered.
 * @method handleBackspace Moves the focus to the previous input element when backspace is pressed on an empty input.
 * @method allowOnlyNumbers Allows only numeric input in the code input fields.
 * @method handlePaste Handles paste event to allow pasting a 6-digit code into the input fields.
 */

import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { PanelService } from '../../Services/panel.service';
import { ProfileService } from '../../Services/profile.service';
import { SettingsService } from '../../Services/settings.service';
import { jwtDecode } from 'jwt-decode';
import { PatientService } from '../../Services/patient.service';
import { AllergyService } from '../../Services/allergy.service';
import { MedicalConditionService } from '../../Services/medical-condition.service';
import { MedicalHistoryService } from '../../Services/medical-history.service';
import { CommonModule } from '@angular/common';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [SidebarComponent, CommonModule, FormsModule],
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss']
})

export class PatientProfileComponent implements OnInit {
  patientProfile: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: number;
    email: string;
    phoneNumber: string;
    emergencyContact: string;
    fullName: string;
    id: string;
    isActive: boolean;
    medicalHistory: string;
    medicalRecordNumber: string;
  } = {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 0,
      email: '',
      phoneNumber: '',
      emergencyContact: '',
      fullName: '',
      id: '',
      isActive: false,
      medicalHistory: '',
      medicalRecordNumber: ''
    };

  allergies: { id: string; allergyName: string; }[] = [];
  medicalConditions: { id: string; medicalConditionName: string; }[] = [];
  selectedAllergies: { id: string; allergyName: string; }[] = [];
  selectedMedicalConditions: { id: string; medicalConditionName: string; }[] = [];
  selectedMedicalHistory: { id: string, patientMedicalRecordNumber: string, medicalConditions: string[], allergies: string[], freeText: string, familyHistory: string[] } | undefined;
  filteredAllergies: { id: string; allergyName: string; }[] = [];
  filteredMedicalConditions: { id: string; medicalConditionName: string; }[] = [];
  checkCode: string = "";
  code1!: number | undefined;
  code2!: number | undefined;
  code3!: number | undefined;
  code4!: number | undefined;
  code5!: number | undefined;
  code6!: number | undefined;
  code!: number;
  isModalOpen: boolean = false;

  constructor(
    private panelService: PanelService,
    private settingsService: SettingsService,
    private profileService: ProfileService,
    private patientService: PatientService,
    private allergyService: AllergyService,
    private medicalConditionService: MedicalConditionService,
    private medicalHistoryService: MedicalHistoryService,
  ) { }

  ngOnInit(): void {
    this.panelService.setPanelId('patient-panel');
    this.settingsService.setSettingsId('patient-settings');
    this.profileService.setProfileId('patient-profile');
    this.fetchAllergies();
    this.fetchMedicalConditions();
    this.getPatientProfile();
  }

  getPatientProfile(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const email = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
      this.patientService.getMyProfile(email).subscribe((response: any) => {
        console.log(response);
        this.patientProfile = response[0];
        this.fetchMedicalHistory(this.patientProfile.medicalRecordNumber);
      });
    }
  }

  fetchAllergies(): void {
    this.allergyService.getAllergies().subscribe(
      (response: any) => {
        this.allergies = response;
        this.filteredAllergies = this.allergies;
        console.log('Allergies fetched:', this.allergies);
      },
      error => {
        console.error('Error fetching allergies', error);
      }
    );
  }

  fetchMedicalConditions(): void {
    this.medicalConditionService.getMedicalConditions().subscribe(
      (response: any) => {
        this.medicalConditions = response;
        this.filteredMedicalConditions = this.medicalConditions;
        console.log('Medical Conditions fetched:', this.medicalConditions);
      },
      error => {
        console.error('Error fetching medical conditions', error);
      }
    );
  }

  fetchMedicalHistory(medicalRecordNumber: string): void {
    console.log('fetchMedicalHistory called with medicalRecordNumber:', medicalRecordNumber);
    this.medicalHistoryService.getPatientMedicalHistory(medicalRecordNumber).subscribe(
      (response: any) => {
        if (response) {
          this.selectedMedicalHistory = {
            id: response.id,
            patientMedicalRecordNumber: response.patientMedicalRecordNumber,
            medicalConditions: response.medicalConditions ? response.medicalConditions.split(',') : [],
            allergies: response.allergies ? response.allergies.split(',') : [],
            freeText: response.freeText,
            familyHistory: Array.isArray(response.familyHistory) ? response.familyHistory : this.parseFamilyHistoryString(response.familyHistory)
          };
          console.log('Medical history fetched:', this.selectedMedicalHistory);
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
      .split(/,(?=\s*[A-Za-z]+:)/)
      .map(entry => entry.trim());
  }


  parseFamilyHistory(familyHistory: string[]): { relationship: string; conditions: string[] }[] {
    return familyHistory.map(entry => {
      const [relationship, conditionsString] = entry.split(': ');

      if (!conditionsString) {
        return { relationship, conditions: [] };
      }

      const conditions = conditionsString
        .split(';')
        .map(cond => cond.trim())
        .filter(cond => cond.length > 0);

      return {
        relationship: relationship.trim(),
        conditions,
      };
    });
  }

  filterSelectedAllergies(): void {
    if (this.selectedMedicalHistory) {
      this.selectedAllergies = this.allergies
        .filter(allergy => this.selectedMedicalHistory!.allergies.includes(allergy.id));
      this.filteredAllergies = this.selectedAllergies;
      console.log('Filtered allergies:', this.selectedAllergies);
    }
  }

  filterSelectedMedicalConditions(): void {
    if (this.selectedMedicalHistory) {
      this.selectedMedicalConditions = this.medicalConditions
        .filter(condition => this.selectedMedicalHistory!.medicalConditions.includes(condition.id));
      this.filteredMedicalConditions = this.selectedMedicalConditions;
      console.log('Filtered medical conditions:', this.selectedMedicalConditions);
    }
  }

  async downloadProfile() {
    const profileData = {
      fullName: this.patientProfile.fullName,
      email: this.patientProfile.email,
      phoneNumber: this.patientProfile.phoneNumber,
      dateOfBirth: this.patientProfile.dateOfBirth,
      emergencyContact: this.patientProfile.emergencyContact,
      gender: this.patientProfile.gender === 0 ? "Male" : "Female",
      medicalRecordNumber: this.patientProfile.medicalRecordNumber,
      allergies: this.selectedAllergies.map(allergy => allergy.allergyName),
      medicalConditions: this.selectedMedicalConditions.map(condition => condition.medicalConditionName),
      familyHistory: this.selectedMedicalHistory?.familyHistory || [],
      freeText: this.selectedMedicalHistory?.freeText || "None"
    };

    const jsonData = JSON.stringify(profileData, null, 2);

    const zip = new JSZip();
    zip.file("profile.json", jsonData);

    const zipBlob = await zip.generateAsync({ type: "blob" });

    saveAs(zipBlob, "patient_profile.zip");
  }

  openModal(): void {
    this.isModalOpen = true;
    this.profileService.getCode(this.patientProfile.email).subscribe(
      (response: any) => {
        this.checkCode = response;
      },
      error => {
        console.error('Error fetching code', error);
      }
    );
  }

  verifyCode() {
    this.code = parseInt(this.code1!.toString() + this.code2!.toString() + this.code3!.toString() + this.code4!.toString() + this.code5!.toString() + this.code6!.toString());
    if (this.code.toString() === this.checkCode.toString()) {
      this.isModalOpen = false;
      this.downloadProfile();
    } else {
      alert('Invalid code');
    }
    this.code1 = undefined;
    this.code2 = undefined;
    this.code3 = undefined;
    this.code4 = undefined;
    this.code5 = undefined;
    this.code6 = undefined;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  moveFocus(event: any, nextElementId: string) {
    if (event.target.value.length === 1) {
      const nextElement = document.getElementById(nextElementId);
      if (nextElement) {
        nextElement.focus();
      }
    }
  }

  handleBackspace(event: KeyboardEvent, prevElementId: string) {
    if (event.key === 'Backspace' && (event.target as HTMLInputElement).value === '') {
      const prevElement = document.getElementById(prevElementId);
      if (prevElement) {
        prevElement.focus();
      }
    }
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  handlePaste(event: ClipboardEvent) {
    const pasteData = event.clipboardData?.getData('text');
    if (pasteData && /^\d{6}$/.test(pasteData)) {
      event.preventDefault();
      const digits = pasteData.split('');
      this.code1 = parseInt(digits[0], 10);
      this.code2 = parseInt(digits[1], 10);
      this.code3 = parseInt(digits[2], 10);
      this.code4 = parseInt(digits[3], 10);
      this.code5 = parseInt(digits[4], 10);
      this.code6 = parseInt(digits[5], 10);
      setTimeout(() => {
        const nextElement = document.getElementById('code6');
        if (nextElement) {
          nextElement.focus();
        }
      }, 0);
    }
  }
}
