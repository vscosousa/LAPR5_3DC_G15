/**
 * @fileoverview UpdateConditionsComponent is responsible for updating medical conditions.
 * 
 * @author Vasco Sousa (1221700)
 * @date 11/12/2024
 * 
 * @class UpdateConditionsComponent
 * @description This component allows users to update existing medical conditions.
 * 
 * @method onSubmit
 * @description Submits the updated medical condition to the server and handles the response.
 */

import { MedicalConditionService } from './../../../Services/medical-condition.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-update-conditions',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-conditions.component.html',
  styleUrls: ['./update-conditions.component.scss']
})
export class UpdateConditionsComponent {

  @Input() medicalCondition: any;

  @Output() conditionUpdated = new EventEmitter<void>();

  constructor(
    private medicalConditionService: MedicalConditionService,
  ) {}

    onSubmit(): void {
      const conditionId = this.medicalCondition.id;
      this.medicalConditionService.updateCondition(conditionId, this.medicalCondition).subscribe({
        next: () => {
          alert('Condition updated successfully!');
          this.conditionUpdated.emit();
        },
        error: (err: any) => {
          console.error('Error creating condition:', err);
          alert('Failed to update condition.');
        }
      });
    }
}
