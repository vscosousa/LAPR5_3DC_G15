import { Component, OnInit} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StaffService } from '../../Services/staff-sevice.service'; 
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { AvailabilityModalComponent } from '../view-availability/availability-modal/availability-modal.component';

@Component({
  selector: 'app-update-staff',
  standalone: true,
  imports: [FormsModule, CommonModule, AvailabilityModalComponent, SidebarComponent, ReactiveFormsModule, RouterModule],
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
        identifier: [''],
        phoneNumber: [''],
        email: new FormControl('', [Validators.email]),
        addAvailabilitySlots: [''],
        removeAvailabilitySlots: [''],
        specializationName: ['']
      });
      this.staffId = this.route.snapshot.paramMap.get('id') || '';
    }
  
    ngOnInit(): void {
      this.loadSpecializations();
      this.loadStaffDetails();
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
  
    loadStaffDetails(): void {
      this.staffService.getStaffById(this.staffId).subscribe({
        next: (data) => {
          this.initFromUpdate(data);
          this.staffName = data.fullName;
          console.log("Staff details:\n", data);
        },
        error: (error) => {
          console.error('Error Get Staff to Update', error);
          alert('Error Get Staff to Update' + error.error );
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
        specializationName: this.getSpecializationName(data.specializationId)
      });
    }

    getSpecializationName(specializationId: string): string {
      const specialization = this.specializations.find(spec => spec.id.value === specializationId);
      return specialization ? specialization.specOption : 'Unknown';
    }

    onSubmit(): void {
      const updateData = {
        phoneNumber: (this.updateStaffForm.value.identifier?.trim() || '') + (this.updateStaffForm.value.phoneNumber?.trim() || ''),
        email: this.updateStaffForm.value.email?.trim() || '',
        addAvailabilitySlots:'',
        removeAvailabilitySlots:'',
        specializationName: this.updateStaffForm.value.specializationName?.trim() || '',
      };
      
      if (Object.values(updateData).every(value => !value)) {
        this.errorMessage = "At least one search parameter is required.";
        return;
      }
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
            } else {
              alert('Create Updating failed - ' + error.error);
            }
          }
      });
    }

}


