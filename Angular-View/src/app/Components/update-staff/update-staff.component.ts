import { Component, OnInit} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StaffService } from '../../Services/staff-sevice.service'; 
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

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
    infoMessage: string = '';
    specializations: any[] = [];

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
      // Carregar detalhes do staff se necessário
    }
  
    onSubmit(): void {
      const updateData = {
        identifier: this.updateStaffForm.value.identifier!.trim(),
        phoneNumber: this.updateStaffForm.value.phoneNumber!.trim(),
        email: this.updateStaffForm.value.email!.trim(),
        addAvailabilitySlots: this.updateStaffForm.value.addAvailabilitySlots!.trim(),
        removeAvailabilitySlots: this.updateStaffForm.value.removeAvailabilitySlots!.trim(),
        specializationName: this.updateStaffForm.value.specializationName!
      };
      
      if (Object.values(updateData).every(value => !value)) {
        this.errorMessage = "At least one search parameter is required.";
        return;
      }
      console.log("Update data:\n", updateData);
      this.staffService.updateStaff(this.staffId, updateData).subscribe({
        next: () => {
            this.errorMessage = '';
            this.infoMessage = 'Staff updated successfully';
            // this.router.navigate(['/search-staffs']);
            this.updateStaffForm.reset(
              {
                identifier: '',
                phoneNumber: '',
                email: '',
                addAvailabilitySlots: '',
                removeAvailabilitySlots: '',
                specializationName: '',
              }
            );
          },
          error: (error) => {
            this.infoMessage = '';
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


