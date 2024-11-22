/**
 * US 6.2.4 - As an BackOffice User, I want to log in to the system
 * US Developed By: João Pereira - 1211503
 *
 * Finished at 09/11/2024
 *
 * Component for handling user login.
 *
 * @component
 * @selector app-login
 * @standalone true
 * @imports [FormsModule, ReactiveFormsModule, RouterModule]
 *
 * @class LoginComponent
 *
 * @property {string} passwordFieldType - The type of the password field (password/text).
 * @property {FormGroup} loginForm - The form group for the login form.
 *
 * @method togglePasswordVisibility Toggles the visibility of the password field.
 * @method onSubmit Handles the form submission for logging in.
 */

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../Services/login.service';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  passwordFieldType: string = 'password';
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });
  loginError: string | null = null;

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    if (typeof document !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => this.initializeGoogleSignIn();
      document.head.appendChild(script);
    }
  }

  initializeGoogleSignIn(): void {
    google.accounts.id.initialize({
      client_id: '421903046401-5q20kb0ijen3tah9r68ngg2m1kmv66bj.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this)
    });

    google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      { theme: 'outline', size: 'large' }
    );
  }

  handleCredentialResponse(response: any): void {
    console.log('Encoded JWT ID token: ' + response.credential);
    this.sendTokenToBackend(response.credential);
  }

  sendTokenToBackend(token: string): void {
    this.loginService.sendTokenToBackend(token).subscribe(
      response => {
        const token: string = response.body as string;
        if (token) {
          localStorage.setItem('token', token);
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          const role = tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

          if (role === 'Admin') {
            this.router.navigate(['/panel-admin']);
          } else if (role === 'Patient') {
            this.router.navigate(['/patient-panel']);
          } else if (role === 'Doctor') {
            this.router.navigate(['/panel-doctor']);
          } else {
            console.error('Unknown role:', role);
            this.router.navigate(['/']);
          }
        } else {
          console.error('Token is missing or invalid');
        }
      },
      (error: any) => {
        if (error.status === 401) {
          this.router.navigate(['/register'], { queryParams: { token } });
        }
        console.error('Login failed', error);
        this.loginError = 'Invalid email or password';
      }
    );
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loginService.login(
      this.loginForm.value.email!,
      this.loginForm.value.password!
    ).subscribe(
      response => {
        const token: string = response.body as string;
        if (token) {
          localStorage.setItem('token', token);
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          const role = tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

          if (role === 'Admin') {
            this.router.navigate(['/panel-admin']);
          } else if (role === 'Patient') {
            this.router.navigate(['/patient-panel']);
          } else if (role === 'Doctor') {
            this.router.navigate(['/panel-doctor']);
          } else {
            console.error('Unknown role:', role);
            this.router.navigate(['/']);
          }
        } else {
          console.error('Token is missing or invalid');
        }
      },
      (error: any) => {
        console.error('Login failed', error);
        this.loginError = 'Invalid email or password';
      }
    );
  }
}
