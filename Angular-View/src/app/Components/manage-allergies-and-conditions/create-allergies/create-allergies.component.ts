import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AllergyService } from '../../../Services/allergy.service';
import { string } from 'three/webgpu';

@Component({
  selector: 'app-create-allergies',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-allergies.component.html',
  styleUrls: ['./create-allergies.component.scss']
})
export class CreateAllergiesComponent {

  allergy: {
    allergyCode: string,
    allergyName: string,
    allergyDescription: string,
    allergySymptoms: string
  } = {
    allergyCode: '',
    allergyName: '',
    allergyDescription: '',
    allergySymptoms: ''
  };

  @Output() allergyCreated = new EventEmitter<void>();

  constructor(
    private allergyService: AllergyService,
  ) {}

  onSubmit(): void {
    this.allergyService.createAllergy(this.allergy).subscribe({
      next: () => {
        alert('Allergy created successfully!');
        this.allergyCreated.emit();
      },
      error: (err: any) => {
        console.error('Error creating allergy:', err);
        alert('Failed to create allergy.');
      }
    });
  }
}
