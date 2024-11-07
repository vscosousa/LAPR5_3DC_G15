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

  constructor(private loginService: LoginService, private router: Router) { }

  onSubmit() {
    this.loginService.login(this.email, this.password).subscribe(
      response => {
        const token: string = response.body as string;
        if (token) {
          localStorage.setItem('token', token);
          this.router.navigate(['/navbar-admin']);
        } else {
          console.error('Token is null');
        }
      },
      error => {
        console.error('Login failed', error);
        

      }
    );
  }
}