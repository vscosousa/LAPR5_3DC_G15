import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { OperationTypeService } from '../../../Services/operation-type.service';

@Component({
  selector: 'app-create-operation-type',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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

  constructor(private operationTypeService: OperationTypeService) {
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
      },
      error => {
        console.error('Error creating operation type', error);
        alert('Error creating operation type');
      }
    );
  }
}
