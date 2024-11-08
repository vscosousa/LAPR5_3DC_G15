import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  passwordFieldType: string = 'password';

  constructor(private loginService: LoginService, private router: Router) { }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onSubmit() {
    this.loginService.login(this.email, this.password).subscribe(
      response => {
        const token: string = response.body as string;
        if (token) {
          localStorage.setItem('token', token);
          //Decode the token to get the user role
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          const role = tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

          if (role === 'Admin') {
            this.router.navigate(['/navbar-admin']);
          } else if (role === 'Patient') {
            this.router.navigate(['/register']);
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
      }
    );
  }
}