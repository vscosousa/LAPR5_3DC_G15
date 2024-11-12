import { Component } from '@angular/core';
import { DeleteUserService } from '../../Services/delete-user.service';
import { Router } from '@angular/router';
import { Console } from 'console';

@Component({
  selector: 'app-delete-user',
  standalone: true,
  imports: [],
  templateUrl: './delete-user.component.html',
  styleUrl: './delete-user.component.scss'
})
export class DeleteUserComponent {
  constructor(private deleteUserService: DeleteUserService, private router: Router) { }

  ngOnInit(): void {
  }

  onDelete() {
    const urlParams = new URLSearchParams(window.location.search);
    const token: string | null = urlParams.get('token');
    console.log('Token:', token);
    if (token) {
      this.deleteUserService.deleteAccount(token).subscribe(
      response => {
        console.log('Request Finished With Success', response);
        this.router.navigate(['/']);
        alert('Your account has been successfully deleted.');
      },
      error => {
        console.error('Account deletion failed', error);
        alert('Account deletion failed - ' + error.error);
      }
    );
    } else {
      console.error('Token is null');
      alert('Invalid token. Account deletion failed.');
    }
  }

  onCancel() {
    console.log('Cancel action triggered');
    this.router.navigate(['/']);
    alert('Account deletion cancelled.');
  }
}
