import { Component, EventEmitter, Input, Output, importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AllergyService } from '../../../Services/allergy.service';

@Component({
  selector: 'app-update-allergies',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-allergies.component.html',
  styleUrls: ['./update-allergies.component.scss']
})
export class UpdateAllergiesComponent {

  @Input() allergy: any;

  @Output() allergyUpdated = new EventEmitter<void>();

  constructor(
    private allergyService: AllergyService,
  ) {}

    onSubmit(): void {
      const allergyId = this.allergy.id;
      console.log('Allergy:', this.allergy);
      console.log('Allergy ID:', allergyId);
      this.allergyService.updateAllergy(allergyId, this.allergy).subscribe({
        next: () => {
          alert('Allergy updated successfully!');
          this.allergyUpdated.emit();
        },
        error: (err: any) => {
          console.error('Error updating allergy:', err);
          alert('Failed to update allergy.');
        }
      });
    }
}
