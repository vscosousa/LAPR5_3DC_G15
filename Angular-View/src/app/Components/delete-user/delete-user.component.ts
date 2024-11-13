import { Component } from '@angular/core';
import { DeleteUserService } from '../../Services/delete-user.service';
import { Router } from '@angular/router';

/**
 * @class DeleteUserComponent
 * @description TS file for the delete-user component.
 * @implements OnInit
 * @vscosousa - 12/11/2024
 */
@Component({
  selector: 'app-delete-user',
  standalone: true,
  imports: [],
  templateUrl: './delete-user.component.html',
  styleUrl: './delete-user.component.scss'
})
export class DeleteUserComponent {
  /**
   * Service to handle user deletion operations.
   * @constructor
   * @param {DeleteUserService} deleteUserService
   * @param {Router} router
   * @vscosousa - 12/11/2024
   */
  constructor(private deleteUserService: DeleteUserService, private router: Router) { }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * @method ngOnInit
   * @vscosousa - 12/11/2024
   */
  ngOnInit(): void {
  }

  /**
   * Handles the user deletion process.
   * @method onDelete
   * @vscosousa - 12/11/2024
   */
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

  /**
   * Handles the cancellation of the user deletion process.
   * @method onCancel
   * @vscosousa - 12/11/2024
   */
  onCancel() {
    console.log('Cancel action triggered');
    this.router.navigate(['/']);
    alert('Account deletion cancelled.');
  }
}
