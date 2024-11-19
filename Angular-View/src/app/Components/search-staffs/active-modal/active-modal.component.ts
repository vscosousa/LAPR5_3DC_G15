import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StaffService } from '../../../Services/staff-sevice.service'; 

@Component({
  selector: 'app-active-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './active-modal.component.html',
  styleUrl: './active-modal.component.scss'
})

export class ActiveModalComponent {
  @Input() profile: any;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<{ username: string }>();
  username: string = '';
  errorMessage: string = ''; 

  constructor(private staffService: StaffService) { }

  onModalClick(event: Event): void {
    event.stopPropagation();
  }
  ngOnInit(): void {

    console.log('ActiveModalComponent initialized', this.profile);
  }

  closeModal(): void {
    this.close.emit();
  }

  onSubmit(): void {

    if (this.username === ''){
      this.errorMessage = 'Username is required';
      return;
    }
    
    const userInfo = {
      email: this.profile.email,
      username: this.username,
      staffType: this.profile.staffType,
      staffId: this.profile.id
    }
    console.log('Activating user:', userInfo);
    this.staffService.activateStaff(userInfo).subscribe({
        next: (response) => {
          this.errorMessage = '';
          this.username = '';
          console.log('User activated:', response);
          this.close.emit();
        },
        error: (error) => {
          console.error('Error Activating staff', error);
          if (error.status === 400) {
            const errorMessage = error.error.message;
            this.errorMessage = errorMessage;
          } else if (error.status === 401){
            alert('Unauthorized page access');
          } else {
            alert('Activing staff failed - ' + error.error);
          }
        }
    });
  }
}