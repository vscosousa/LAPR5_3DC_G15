import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * @class AppComponent
 * @description TS file for the main application component.
 * @vscosousa - 05/11/2024
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Angular-View';

  /**
   * @constructor
   * @param {Router} router - The router to navigate to different routes.
   * @vscosousa - 05/11/2024
   */
  constructor(public router: Router) {}
}
