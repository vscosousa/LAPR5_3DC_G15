import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RegisterService } from '../../services/register.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SidebarComponent, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  email: string = '';
  identifier: string = '';
  phoneNumber: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private registerService: RegisterService, private router: Router) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.registerService.register(this.email, this.identifier, this.phoneNumber, this.password).subscribe(
      response => {
        console.log('Registration successful', response);
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Registration failed', error);
      }
    );
  }
}
