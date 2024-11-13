import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../Services/login.service';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  passwordFieldType: string = 'password';
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  constructor(private loginService: LoginService, private router: Router) { }

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
          } else {
            console.error('Unknown role:', role);
            this.router.navigate(['/""']);
          }
        } else {
          console.error('Token is missing or invalid');
        }
      },
      (error: any) => {
        console.error('Login failed', error);
        alert('Login failed - ' + error.error);
      }
    );
  }
}
