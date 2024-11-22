import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StaffService } from '../../Services/staff-sevice.service'; 
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-staff',
  standalone: true,
  imports: [FormsModule, CommonModule, SidebarComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './create-staff.component.html',
  styleUrls: ['./create-staff.component.scss']
})
export class CreateStaffComponent implements OnInit{

  createStaffForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      fullName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      identifier: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      staffType: new FormControl('', [Validators.required]),
      specializationName: new FormControl('', [Validators.required])
    });
  
  staffTypes: string[] = [];
  specializations:  any[] = [];
  errorMessage: string = '';
  NumberPhone: string = '';
  
  constructor(public service: StaffService, private router: Router) {}

  ngOnInit(): void {
    this.loadSpecializations();
    this.loadStaffTypes();
  }

  loadSpecializations(): void {
    this.service.getSpecialization().subscribe({
      next: (data) => {
        console.log("Data specilazation:\n",data)
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

  loadStaffTypes(): void {
    this.service.getStaffTypes().subscribe({
      next: (data) => {
        console.log("Data staff types:\n", data);
        this.staffTypes = data;
      },
      error: (error) => {
        console.error('Error loading staff types', error);
        if (error.status === 401){
          alert('Unauthorized page access');
        } else {
          alert('Error loading staff types ');
        }
      }
    });
  }

  onSubmit() {
    if (this.createStaffForm.invalid) {
      this.errorMessage = '';
      this.createStaffForm.markAllAsTouched();
      return;
    }

    if (this.createStaffForm.valid) {
      this.service.createStaff(
        this.createStaffForm.value.firstName!.trim(),
        this.createStaffForm.value.lastName!.trim(),
        this.createStaffForm.value.fullName!.trim(),
        this.createStaffForm.value.email!.trim(),
        this.createStaffForm.value.identifier!.trim(),
        this.createStaffForm.value.phoneNumber!.trim(),
        this.createStaffForm.value.staffType!.trim(),
        this.createStaffForm.value.specializationName!.trim()
      ).subscribe({
        next: (response) => {
          console.log('Staff created successfully', response);
          this.errorMessage = '';
          this.router.navigate(['/search-staffs']);
        },
        error: (error) => {
          console.error('Error creating staff', error);
          if (error.status === 400) {
            const errorResponse = JSON.parse(error.error);
            this.errorMessage =  errorResponse.message;
          } else if (error.status === 401){
            alert('Unauthorized page access');
          } else {
            alert('Creating failed - ' + error.error);
          }
        }
      });
    }
  }
}