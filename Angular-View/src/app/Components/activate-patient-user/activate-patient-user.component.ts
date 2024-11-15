import { Component } from '@angular/core';
import { ActivateUserService } from '../../Services/activate-user.service';
import { Router } from '@angular/router';

/**
 * @class ActivatePatientUserComponent
 * @description TS file for the activate-patient-user component.
 * @implements OnInit
 * @vscosousa - 15/11/2024
 */
@Component({
  selector: 'app-activate-patient-user',
  standalone: true,
  imports: [],
  templateUrl: './activate-patient-user.component.html',
  styleUrls: ['./activate-patient-user.component.scss']
})
export class ActivatePatientUserComponent {
  /**
   * Service to handle user activation operations.
   * @constructor
   * @param {ActivateUserService} activateUserService
   * @param {Router} router
   * @vscosousa - 15/11/2024
   */
  constructor(private activateUserService: ActivateUserService, private router: Router) { }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * @method ngOnInit
   * @vscosousa - 15/11/2024
   */
  ngOnInit(): void {
  }

  /**
   * Handles the user activation process.
   * @method onActivate
   * @vscosousa - 15/11/2024
   */
  onActivate() {
    const urlParams = new URLSearchParams(window.location.search);
    const token: string | null = urlParams.get('token');
    console.log('Token:', token);
    if (token) {
      this.activateUserService.activateAccount(token).subscribe(
        response => {
          console.log('Request Finished With Success', response);
          this.router.navigate(['/']);
          alert('Your account has been successfully activated.');
        },
        error => {
          console.error('Account activation failed', error);
          alert('Account activation failed - ' + error.error);
        }
      );
    } else {
      console.error('Token is null');
      alert('Invalid token. Account activation failed.');
    }
  }

  /**
   * Handles the cancellation of the user activation process.
   * @method onCancel
   * @vscosousa - 15/11/2024
   */
  onCancel() {
    console.log('Cancel action triggered');
    this.router.navigate(['/']);
    alert('Account activation cancelled.');
  }
}
