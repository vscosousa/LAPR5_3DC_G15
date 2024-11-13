import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StaffService } from '../../Services/staff-sevice.service'; 
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-search-staffs',
  standalone: true,
  imports: [FormsModule, CommonModule, SidebarComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './search-staffs.component.html',
  styleUrls: ['./search-staffs.component.scss']
})

export class SearchStaffsComponent implements OnInit {
  searchForm!: FormGroup;
  staffProfiles: any[] = [];
  errorMessage: string = '';
  specializations: any[] = [];
  selectedStaff: any = null;
  infoMessage: string = '';

  constructor(private fb: FormBuilder, private staffService: StaffService) {

  }

  ngOnInit(): void {
    this.loadSpecializations();
    this.searchForm = this.fb.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      fullName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      specializationName: new FormControl('', [Validators.required])
    });
  }

  loadSpecializations(): void {
    this.staffService.getSpecialization().subscribe({
      next: (data) => {
        console.log("Data specialization:\n", data);
        this.specializations = data;
      },
      error: (error) => {
        console.error('Error loading specializations', error);
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
    this.staffProfiles = [];
    this.errorMessage = '';
    this.infoMessage = '';
  }

  onSearch(): void {

    const searchCriteria = {
      firstName: this.searchForm.value.firstName!.trim(),
      lastName: this.searchForm.value.lastName!.trim(),
      fullName: this.searchForm.value.fullName!,
      email: this.searchForm.value.email!.trim(),
      specializationName: this.searchForm.value.specializationName!
    };

    if (Object.values(searchCriteria).every(value => !value)) {
      this.errorMessage = "At least one search parameter is required.";
      return;
    }

    this.staffService.searchStaffProfiles(searchCriteria)
      .subscribe({
        next: (response) => {
          this.errorMessage = '';
          if (Array.isArray(response)) {
            this.infoMessage='';
            this.staffProfiles = response;
          } else {
            this.infoMessage = 'No staff profiles found with the given search.';
            this.staffProfiles = [];
          }
        },
        error: (error) => {
          console.error('Error search staff', error);
          this.infoMessage='';
          this.staffProfiles = [];
          if (error.status === 400) {
            const errorMessage = error.error.message;
            this.errorMessage = errorMessage;
          } else {
            alert('Search Staff failed - ' + error.error);
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
        this.onSearch();
      },
      error: (error) => {
        console.error('Error deactivating staff', error);
        this.infoMessage='';
        if (error.status === 400) {
          const errorMessage = error.error.message;
          this.errorMessage = errorMessage;
        } else {
          alert('Search Staff failed - ' + error.error);
        }
      }
    });
  }
}