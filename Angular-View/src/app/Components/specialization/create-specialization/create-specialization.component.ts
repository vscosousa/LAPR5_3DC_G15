/**
 * US 7.2.11 - As an Admin, I want to create Specializations.
 * 
 * US Developed By: João Pereira - 1211503
 * Finished at 06/12/2024 
 * @class CreateSpecializationComponent
 * 
 * @property {Object} specialization - The specialization object to be created.
 * @property {EventEmitter<void>} specializationCreated - Event emitter to notify parent component of the creation.
 * 
 * @method onSubmit Submits the form to create a new specialization.
 */

import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SpecializationService } from '../../../Services/specialization.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-specialization',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-specialization.component.html',
  styleUrls: ['./create-specialization.component.scss'],
})
export class CreateSpecializationComponent {
  // Object to hold the specialization data
  specialization = { specializationType: '' };

  // Event emitter to notify parent component of the creation
  @Output() specializationCreated = new EventEmitter<void>();

  // Constructor to inject the necessary services
  constructor(
    private specializationService: SpecializationService,
  ) {}

  // Method to submit the form and create a new specialization
  onSubmit(): void {
    this.specializationService.createSpecialization(this.specialization).subscribe({
      next: () => {
        alert('Specialization created successfully!');
        this.specializationCreated.emit();
      },
      error: (err: any) => {
        console.error('Error creating specialization:', err);
        alert('Failed to create specialization.');
      }
    });
  }
}