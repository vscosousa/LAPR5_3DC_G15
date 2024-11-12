import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StaffService } from '../../Services/staff-sevice.service'; 
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-search-staffs',
  standalone: true,
  imports: [FormsModule, CommonModule, SidebarComponent, ReactiveFormsModule],
  templateUrl: './search-staffs.component.html',
  styleUrls: ['./search-staffs.component.scss']
})

export class SearchStaffsComponent implements OnInit {
  searchForm!: FormGroup;
  staffProfiles: any[] = [];
  errorMessage: string = '';
  specializations: any[] = [];

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

  onSearch(): void {
    const searchCriteria = this.searchForm.value;
    if (Object.values(searchCriteria).every(value => !value)) {
      this.searchForm.markAllAsTouched();
      this.errorMessage = "At least one search parameter is required.";
      console.log(this.searchForm.controls);
      return;
    }
    this.staffService.searchStaffProfiles(searchCriteria)
      .subscribe({
        next: (response) => {
          this.errorMessage = '';
          
          console.log('Search staff', response);
          if (Array.isArray(response)) {
            this.staffProfiles = response;
          } else {
            this.staffProfiles = [];
          }

          this.searchForm.reset();
        },
        error: (error) => {
          console.log('Error Search staff', error.status);
          this.staffProfiles = [];
          console.error('Error Search staff', error);
          if (error.status === 400) {
            
            const errorMessage = error.error.message;
            this.errorMessage = errorMessage;
            console.error('Search Staff failed - ' + errorMessage);
            
          } else {
            alert('Search Staff failed - ' + error.error);
          }
        }
      });
  }
}