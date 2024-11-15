import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StaffService } from '../../Services/staff-sevice.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-updates-staff',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-updates-staff.component.html',
  styleUrls: ['./confirm-updates-staff.component.scss']
})
export class ConfirmUpdatesStaffComponent implements OnInit {
  errorMessage: string = '';
  token: string = '';
  phoneNumber: string = '';
  email: string = '';
  updateSuccessful: boolean = false; 

  constructor(private route: ActivatedRoute, private router: Router, private staffService: StaffService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.phoneNumber = params['phoneNumber'] || '';
      this.email = params['email'] || '';
      this.token = params['token'] || '';
    });

  }

  updateContactInfo(): void {
    const updateData = {
      token: this.token,
      phoneNumber: this.phoneNumber,
      email: this.email
    };
    
    this.staffService.confirmUpdates(updateData).subscribe({
      next: (response) => {
        console.log('Updates confirmed', response);
        this.updateSuccessful = true;
      },
      error: (error) => {
        this.updateSuccessful = false;
        console.error('Error confirming updates', error);
        this.errorMessage = 'Failed to confirm updates';
      }
    });
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}