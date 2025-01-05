/**
 * US 7.2.13 - As an Admin, I want to update Specializations.
 * 
 * US Developed By: João Pereira - 1211503
 * Finished at 06/12/2024 
 * 
 * @class UpdateSpecializationComponent
 * 
 * @property {string} specializationId - The ID of the specialization to be updated.
 * @property {EventEmitter<void>} specializationUpdated - Event emitter to notify parent component of the update.
 * 
 * @method ngOnInit Logs the specialization ID when the component is initialized.
 * @method onSubmit Submits the form to update the specialization.
 */


import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Route, Router } from '@angular/router';
import { SpecializationService } from '../../../Services/specialization.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-specialization',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-specialization.component.html',
  styleUrls: ['./update-specialization.component.scss'],
})


export class UpdateSpecializationComponent {
  @Input() specializationId = '';
  @Output() specializationUpdated = new EventEmitter<void>(); // Notify parent to close modal and refresh data


  specialization = { specializationType: '' };

  constructor(
    private route: Router,
    private specializationService: SpecializationService
  ) {}


  ngOnInit(): void {
    console.log('Specialization ID:', this.specializationId);
  }

 
  onSubmit(): void {
    this.specializationService.updateSpecialization(this.specializationId, this.specialization).subscribe({
      next: () => {
        alert('Specialization updated successfully!');
        this.specializationUpdated.emit(); // Notify parent
      },
      error: (err: any) => {
        console.error('Error updating specialization:', err);
        alert('Failed to update specialization.');
      }
    });
  }
}
