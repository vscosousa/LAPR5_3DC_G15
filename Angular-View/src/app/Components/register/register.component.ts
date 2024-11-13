import { Component } from '@angular/core';
import { RegisterService } from '../../Services/register.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

/**
 * @class RegisterComponent
 * @description TS file for the register component.
 * @vscosousa - 08/11/2024
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  passwordFieldType = 'password';
  confirmPasswordFieldType = 'password';
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    identifier: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  });

  /**
   * Service to handle registration-related operations.
   * @constructor
   * @param {RegisterService} registerService
   * @param {Router} router
   * @vscosousa - 08/11/2024
   */
  constructor(private registerService: RegisterService, private router: Router) { }

  /**
   * Toggles the visibility of the password fields.
   * @method togglePasswordVisibility
   * @param {string} fieldId - The ID of the password field to toggle.
   * @vscosousa - 08/11/2024
   */
  togglePasswordVisibility(fieldId: string): void {
    if (fieldId === 'password') {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    } else if (fieldId === 'confirm-password') {
      this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
    }
  }

  /**
   * Handles the form submission for user registration.
   * @method onSubmit
   * @vscosousa - 08/11/2024
   */
  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.registerService.register(
      this.registerForm.value.email!,
      this.registerForm.value.identifier!,
      this.registerForm.value.phoneNumber!,
      this.registerForm.value.password!
    ).subscribe(
      response => {
        console.log('Registration successful', response);
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Registration failed', error);
        alert('Registration failed - ' + error.error);
      }
    );
  }
}
