import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StaffService } from '../../Services/staff-sevice.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-create-staff',
  standalone: true,
  imports: [SidebarComponent, FormsModule],
  templateUrl: './create-staff.component.html',
  styleUrls: ['./create-staff.component.scss']
})
export class CreateStaffComponent {

  firstName: string = "";
  lastName: string = "";
  fullName: string = "";
  email: string = "";
  phoneNumber: string = "";
  staffType: string = "";
  specializationName: string = "";

  constructor(public service: StaffService) {}

  onSubmit() {
    this.service.formSubmitted = true;

    this.service.createStaff(this.firstName, this.lastName, this.fullName, this.email, this.phoneNumber, this.staffType, this.specializationName).subscribe({
      next: res => {
        this.service.resetForm();
      },
      error: err => {
        console.log(err);
      }
    });
  }

}
