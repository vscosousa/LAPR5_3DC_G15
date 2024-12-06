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
  specialization = { specializationType: '' };

  @Output() specializationCreated = new EventEmitter<void>(); // Notify parent to close modal and refresh data

  constructor(
    private specializationService: SpecializationService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.specializationService.createSpecialization(this.specialization).subscribe({
      next: () => {
        alert('Specialization created successfully!');
        this.specializationCreated.emit(); // Notify parent
      },
      error: (err: any) => {
        console.error('Error creating specialization:', err);
        alert('Failed to create specialization.');
      }
    });
  }
}