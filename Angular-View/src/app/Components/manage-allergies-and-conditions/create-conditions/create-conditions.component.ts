/**
 * @class CreateConditionsComponent
 * @description Component for creating medical conditions.
 * @date 09/12/2024
 * @methods
 *  - constructor: Initializes the component with the necessary services.
 *  - onSubmit: Submits the form to create a new medical condition.
 * @output
 *  - conditionCreated: Event emitted when a medical condition is successfully created.
 * @author Vasco Sousa (1221700)
 */

import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MedicalConditionService } from '../../../Services/medical-condition.service';


@Component({
  selector: 'app-create-conditions',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-conditions.component.html',
  styleUrls: ['./create-conditions.component.scss']
})
export class CreateConditionsComponent {

  medicalCondition: {
    medicalConditionCode: string,
    medicalConditionName: string,
    medicalConditionDescription: string,
    medicalConditionSymptoms: string
  } = {
    medicalConditionCode: '',
    medicalConditionName: '',
    medicalConditionDescription: '',
    medicalConditionSymptoms: ''
  };

  @Output() conditionCreated = new EventEmitter<void>();

  constructor(
    private conditionService: MedicalConditionService,
  ) {}

  onSubmit(): void {
    this.conditionService.createMedicalConditions(this.medicalCondition).subscribe({
      next: () => {
        alert('Medical Condition created successfully!');
        this.conditionCreated.emit();
      },
      error: (err: any) => {
        console.error('Error creating condition:', err);
        alert('Failed to create condition.');
      }
    });
  }
}
