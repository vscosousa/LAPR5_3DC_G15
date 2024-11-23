import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StaffService } from '../../Services/staff-sevice.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-active-staff',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './active-staff.component.html',
  styleUrl: './active-staff.component.scss'
})

export class ActiveStaffComponent implements OnInit {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  activationSuccessful: boolean = false;
  newPasswordError: boolean = false;
  confirmPasswordError: boolean = false;

  constructor(private staffService: StaffService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  activateUser(): void {
    this.newPasswordError = !this.newPassword.trim();
    this.confirmPasswordError = !this.confirmPassword.trim();

    if (this.newPasswordError || this.confirmPasswordError) {
      return;
    }

    this.token = this.token.trim();
    this.newPassword = this.newPassword.trim();
    this.confirmPassword = this.confirmPassword.trim();

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.staffService.activateUser(this.token, this.newPassword).subscribe({
      next: (user) => {
        console.log('User activated', user);
        this.errorMessage = '';
        this.activationSuccessful = true;
      },
      error: (error) => {
        console.error('Error activating user', error);
        if (error.status === 400) {
          const errorResponse = error.error;
          this.errorMessage = errorResponse.message;
        } else if (error.status === 401) {
          alert('Unauthorized page access');
        } else {
          alert('Activation failed - ' + error.error);
        }
      }
    });
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}