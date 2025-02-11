import { Component, OnInit} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StaffService } from '../../Services/staff-sevice.service'; 
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-update-staff',
  standalone: true,
  imports: [FormsModule, CommonModule, SidebarComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './update-staff.component.html',
  styleUrl: './update-staff.component.scss'
})


export class UpdateStaffComponent implements OnInit {
    updateStaffForm: FormGroup;
    staffId: string;
    errorMessage: string = '';
    specializations: any[] = [];
    staffName: string = '';

    constructor( private staffService: StaffService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
      this.updateStaffForm = this.fb.group({
        identifier: new FormControl('', [Validators.required]),
        phoneNumber: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        addAvailabilitySlots: [''],
        removeAvailabilitySlots: [''],
        specializationName: new FormControl('', [Validators.required])
      });
      this.staffId = this.route.snapshot.paramMap.get('id') || '';
      if (!this.staffId) {
        alert('Staff ID not found in the route');
      }
    }
  
    ngOnInit(): void {
      this.loadSpecializations().then(() => {
        this.loadStaffDetails();
      });
    }
  
    loadSpecializations(): Promise<void> {
      return new Promise((resolve, reject) => {
        this.staffService.getSpecialization().subscribe({
          next: (data) => {
            console.log("Data specialization:\n", data);
            this.specializations = data;
            resolve();
          },
          error: (error) => {
            console.error('Error loading specializations', error);
            if (error.status === 401) {
              alert('Unauthorized page access');
            } else {
              alert('Error loading specializations');
            }
            reject(error);
          }
        });
      });
    }
  
    loadStaffDetails(): void {
      this.staffService.getStaffById(this.staffId).subscribe({
        next: (data) => {
          this.initFromUpdate(data);
          this.staffName = data.fullName;
          console.log("Staff details:\n", data);
        },
        error: (error) => {
          console.error('Error Get Staff to Update', error);
          if (error.status === 401){
            alert('Unauthorized page access');
          } else {
            alert('Error loading staff details');
          }
        }
      });
    }

    initFromUpdate(data: any): void {
      const phoneNumber = data.phoneNumber;
      const identifier = phoneNumber.substring(0, 4); 
      const localPhoneNumber = phoneNumber.substring(4);
  
      this.updateStaffForm.patchValue({
        identifier: identifier,
        phoneNumber: localPhoneNumber,
        email: data.email,
        addAvailabilitySlots: '',
        removeAvailabilitySlots: '',
        specializationName: this.getSpecializationName(data.specializationId.trim())
      });
    }

    getSpecializationName(specializationId: string): string {
      const specialization = this.specializations.find(spec => spec.id.value === specializationId);
      return specialization ? specialization.specOption : 'Unknown';
    }

    onSubmit(): void {
  
      if (this.updateStaffForm.invalid) {
        this.errorMessage = '';
        this.updateStaffForm.markAllAsTouched();
        return;
      }

      const updateData = {
        phoneNumber: (this.updateStaffForm.value.identifier?.trim() || '') + (this.updateStaffForm.value.phoneNumber?.trim() || ''),
        email: this.updateStaffForm.value.email?.trim() || '',
        addAvailabilitySlots:'',
        removeAvailabilitySlots:'',
        specializationName: this.updateStaffForm.value.specializationName?.trim() || '',
      };

      console.log("Update data:\n", updateData);
      this.staffService.updateStaff(this.staffId, updateData).subscribe({
        next: () => {
            console.log('Staff Updated Successfully');
            this.errorMessage = '';
            this.router.navigate(['/search-staffs'])
          },
          error: (error) => {
            console.error('Error Updating staff', error);
            if (error.status === 400) {
              const errorResponse = error.error;
              this.errorMessage =  errorResponse.message;
            } else if (error.status === 401){
              alert('Unauthorized page access');
            } else {
              alert('Updating failed - ' + error.error);
            }
          }
      });
    }

}


