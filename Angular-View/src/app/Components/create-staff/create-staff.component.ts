import { Component, OnInit} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StaffService } from '../../Services/staff-sevice.service'; 
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-create-staff',
  standalone: true,
  imports: [FormsModule, CommonModule, SidebarComponent, ReactiveFormsModule],
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
  
  specializations:  any[] = [];
  errorMessage: string = '';
  NumberPhone: string = '';

  constructor(public service: StaffService) {}

  ngOnInit(): void {
    this.loadSpecializations();
  }

  loadSpecializations(): void {
    this.service.getSpecialization().subscribe({
      next: (data) => {
        console.log("Data specilazation:\n",data)
        this.specializations = data;
      },
      error: (error) => {
        console.error('Error loading specializations', error);
      }
    });
  }

  onSubmit() {
    if (this.createStaffForm.invalid) {
      console.error('Form is invalid');
      this.createStaffForm.markAllAsTouched();
      return;
    }
    console.log('Form is valid', this.createStaffForm.value);

    if (this.createStaffForm.valid) {
      this.service.createStaff(
        this.createStaffForm.value.firstName!,
        this.createStaffForm.value.lastName!,
        this.createStaffForm.value.fullName!,
        this.createStaffForm.value.email!,
        this.createStaffForm.value.identifier!,
        this.createStaffForm.value.phoneNumber!,
        this.createStaffForm.value.staffType!,
        this.createStaffForm.value.specializationName!
      ).subscribe({
        next: (response) => {
          this.errorMessage = '';
          this.createStaffForm.reset();
          console.log('Staff created successfully', response);
        },
        error: (error) => {
          console.error('Error creating staff', error);
          if (error.status === 400) {
            const errorMessage = error.error.message;
            this.errorMessage =  errorMessage;
          } else {
            alert('Create Staff failed - ' + error.error);
          }
        }
      });
    }
  }
}