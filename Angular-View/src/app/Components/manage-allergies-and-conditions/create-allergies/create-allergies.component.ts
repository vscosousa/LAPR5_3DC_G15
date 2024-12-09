import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AllergyService } from '../../../Services/allergy.service';

@Component({
  selector: 'app-create-allergies',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-allergies.component.html',
  styleUrls: ['./create-allergies.component.scss']
})
export class CreateAllergiesComponent {
  allergyName: string = '';

  @Output() allergyCreated = new EventEmitter<void>();

  constructor(
    private allergyService: AllergyService,
  ) {}

  onSubmit(): void {
    this.allergyService.createAllergy(this.allergyName).subscribe({
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
