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

  @Output() specializationCreated = new EventEmitter<void>();

  constructor(
    private specializationService: SpecializationService,
  ) {}

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
