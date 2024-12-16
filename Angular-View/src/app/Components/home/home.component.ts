import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from 'express';

/**
 * @class HomeComponent
 * @description TS file for the home component.
 * @vscosousa - 05/11/2024
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
