/**
 * US 6.2.18 - As an admin, I want to create a new operation type
 * US Developed By: João Pereira - 1211503
 * 
 * Finished at 11/11/2024
 * Component for creating a new operation type and managing its specializations.
 * 
 * @component
 * @selector app-create-operation-type
 * @standalone true
 * @imports [CommonModule, FormsModule, RouterModule, SidebarComponent]
 * 
 * @class CreateOperationTypeComponent
 * 
 * @property {object} operationType - The operation type data.
 * @property {string} operationType.name - The name of the operation type.
 * @property {string} operationType.estimatedDuration - The estimated duration of the operation type.
 * @property {string[]} operationType.specializations - The specializations associated with the operation type.
 * @property {any[]} availableSpecializations - The list of available specializations.
 * 
 * @method onSpecializationChange Handles the selection of specializations.
 * @method onSubmit Handles the form submission to create a new operation type.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { OperationTypeService } from '../../../Services/operation-type.service';

@Component({
  selector: 'app-create-operation-type',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarComponent],
  templateUrl: './create-operation-type.component.html',
  styleUrls: ['./create-operation-type.component.scss']
})
export class CreateOperationTypeComponent {
  operationType = {
    name: '',
    estimatedDuration: '',
    specializations: [] as string[] // Storing names as strings
  };

  availableSpecializations: any[] = [];

  constructor(private router: Router, private operationTypeService: OperationTypeService) {
    operationTypeService.getSpecializations().subscribe(
      (data: any[]) => {
        this.availableSpecializations = data;
      },
      error => {
        console.error('Error fetching specializations', error);
      }
    );
  }

  // Method to handle specialization selection
  onSpecializationChange(specialization: any, event: any) {
    if (event.target.checked) {
      // Add the specialization name to the list
      this.operationType.specializations.push(specialization.specOption);
    } else {
      // Remove the specialization name from the list
      const index = this.operationType.specializations.indexOf(specialization.specOption);
      if (index !== -1) {
        this.operationType.specializations.splice(index, 1);
      }
    }
  }

  // Method to handle form submission
  onSubmit() {
    this.operationTypeService.createOperationType(this.operationType).subscribe(
      () => {
        alert('Operation type created successfully');
        this.operationType = {
          name: '',
          estimatedDuration: '',
          specializations: [] as string[]  // Reset form
        };
        this.router.navigate(['/operation-types']);
      },
      error => {
        console.error('Error creating operation type', error);
        alert('Error creating operation type');
      }
    );
  }
}