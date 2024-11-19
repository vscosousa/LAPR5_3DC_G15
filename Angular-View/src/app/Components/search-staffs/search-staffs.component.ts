import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StaffService } from '../../Services/staff-sevice.service'; 
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { ActiveModalComponent } from './active-modal/active-modal.component';

@Component({
  selector: 'app-search-staffs',
  standalone: true,
  imports: [FormsModule,CommonModule, SidebarComponent, ActiveModalComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './search-staffs.component.html',
  styleUrls: ['./search-staffs.component.scss']
})

export class SearchStaffsComponent implements OnInit {
  searchForm!: FormGroup;
  isModalOpen = false;
  staffProfiles: any[] = [];
  errorMessage: string = '';
  specializations: any[] = [];
  selectedStaff: any = null;
  infoMessage: string = '';
  showAvailabilityModal: boolean = false;
  availabilitySlots: string[] = [];
  username: string = '';
  @Input() profile: any;
  modalProfile: any = null;


  constructor(private fb: FormBuilder, private staffService: StaffService) {
    this.searchForm = this.fb.group({
          firstName: new FormControl('', [Validators.required]),
          lastName: new FormControl('', [Validators.required]),
          fullName: new FormControl('', [Validators.required]),
          email: new FormControl('', [Validators.required, Validators.email]),
          specializationName: new FormControl('', [Validators.required])
        });
  }

  ngOnInit(): void {
    this.loadStaffProfiles();
    this.loadSpecializations();
  }

  loadSpecializations(): void {
    this.staffService.getSpecialization().subscribe({
      next: (data) => {
        console.log("Data specialization:\n", data);
        this.specializations = data;
      },
      error: (error) => {
        console.error('Error loading specializations', error);
        if (error.status === 401){
          alert('Unauthorized page access');
        } else {
          alert('Error loading specializations');
        }
      }
    });
  }

  loadStaffProfiles(): void {
    this.staffService.getAllStaffs().subscribe({
      next: (data) => {
        console.log("Data staff profiles:\n", data);
        this.staffProfiles = data;
      },
      error: (error) => {
        console.error('Error loading staff profiles', error);
        this.infoMessage = '';
        this.staffProfiles = [];
        if (error.status === 401){
          alert('Unauthorized page access');
        } else {
          alert('Error loading staff profiles');
        }
      }
    });
  }

  clearFilters() {
    this.searchForm.reset({
      firstName: '',
      lastName: '',
      fullName: '',
      email: '',
      specializationName: ''
    });
    this.loadStaffProfiles();
    this.errorMessage = '';
    this.infoMessage = '';
  }

  onSearch(): void {

    const searchCriteria = {
      firstName: this.searchForm.value.firstName?.trim() || '',
      lastName: this.searchForm.value.lastName?.trim() || '',
      fullName: this.searchForm.value.fullName?.trim() || '',
      email: this.searchForm.value.email?.trim() || '',
      specializationName: this.searchForm.value.specializationName?.trim() || '',
    };

    if (Object.values(searchCriteria).every(value => !value)) {
      this.errorMessage = "At least one search parameter is required.";
      return;
    }
    console.log("Search criteria", searchCriteria);

    this.infoMessage='';

    this.staffService.searchStaffProfiles(searchCriteria)
      .subscribe({
        next: (response) => {
          this.errorMessage = '';
          if (Array.isArray(response)) {
            this.staffProfiles = response;
          } else {
            this.staffProfiles = [];
          }
        },
        error: (error) => {
          console.error('Error search staff', error);
          this.staffProfiles = [];
          if (error.status === 400) {
            const errorMessage = error.error.message;
            this.errorMessage = errorMessage;
          } else if (error.status === 401){
            alert('Unauthorized page access');
          } else {
            alert('Search Staff - ' + error.error);
          }
        }
      });
  }

  getSpecializationName(specializationId: string): string {
    const specialization = this.specializations.find(spec => spec.id.value === specializationId);
    return specialization ? specialization.specOption : 'Unknown';
  }

  viewStaffDetails(staff: any): void {
    staff.specializationName = this.getSpecializationName(staff.specializationId);
    this.selectedStaff = staff;
  }

  clearSelectedStaff(): void {
    this.selectedStaff = null;
  }

  deactivateStaff(id: string): void {
    this.staffService.deactivateStaff(id).subscribe({
      next: () => {
        this.errorMessage = '';
        this.infoMessage = 'Staff deactivated successfully';
        this.loadStaffProfiles();
      },
      error: (error) => {
        console.error('Error deactivating staff', error);
        this.infoMessage='';
        if (error.status === 400) {
          const errorMessage = error.error.message;
          this.errorMessage = errorMessage;
        } else if (error.status === 401){
          alert('Unauthorized page access');
        } else {
          alert('Deactive staff failed - ' + error.error);
        }
      }
    });
  }

  openModal(profile : any): void {
    this.modalProfile = profile;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.loadStaffProfiles();
    this.modalProfile = null;
    this.isModalOpen = false;
  }
}