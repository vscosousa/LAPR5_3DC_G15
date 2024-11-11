import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule to access ngFor
import { RouterModule } from '@angular/router';
import { OperationTypeService } from '../../Services/operation-type.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-operation-types',
  standalone: true,  // Ensuring this is a standalone component
  imports: [CommonModule, RouterModule, SidebarComponent],  // Add CommonModule here
  templateUrl: './operation-types.component.html',
  styleUrls: ['./operation-types.component.scss']
})
export class OperationTypesComponent implements OnInit {
  operationTypes: any[] = [];
  staffs: any[] = [];

  staffVisibility: { [key: string]: boolean } = {};

  visibleSpecializations = new Map<number, boolean>();

  constructor(private operationTypeService: OperationTypeService) { }

  ngOnInit(): void {
    this.fetchOperationTypes();
  }

  fetchOperationTypes(): void {
    this.operationTypeService.getOperationTypes().subscribe(
      (data: any[]) => {
        this.operationTypes = data;
        console.log('Operation types fetched:', data);

        this.staffs = data.reduce((acc, operationType) => {
          acc[operationType.name] = operationType.staffs || [];
          return acc;
        }, {});
      },
      error => {
        console.error('Error fetching operation types', error);
      }
    );
  }

     // Toggle visibility and fetch staff by specialization
  toggleStaffVisibility(specialization: any): void {
    // Toggle the visibility of staff
    this.staffVisibility[specialization.specOption] = !this.staffVisibility[specialization.specOption];

    // Fetch staff for the selected specialization if not already fetched
    if (this.staffVisibility[specialization.specOption]) {
      console.log('Fetching staff for specialization:', specialization);
      this.fetchStaffBySpecialization(specialization);
    }
  }

  isStaffVisible(specialization: any): boolean {
    return this.staffVisibility[specialization.specOption] || false;  // Default to false if undefined
  }

  fetchStaffBySpecialization(specialization: any): void {
    this.operationTypeService.getStaffs(specialization.specOption).subscribe(
      
      (data: any[]) => {
        console.log('Staff fetched:', data);
        // Filter staff based on the specialization and update the `staffs` array
        this.staffs = data.filter(staff => staff.specialization === specialization.specOption);
      },
      error => {
        console.error('Error fetching staff', error);
      }
    );
  }

  // Method to handle operation type edit
  onEdit(operationType: any): void {
    const selectedOperationType = this.operationTypes.find(opType => opType.id === operationType.id);
    if (!selectedOperationType) {
      console.error('Selected operation type not found');
      return;
    }
    console.log('Editing operation type:', operationType);
    this.operationTypeService.editOperationType(selectedOperationType.name, operationType).subscribe(
      () => {
        alert('Operation type updated successfully');
        this.fetchOperationTypes();
      },
      error => {
        console.error('Error updating operation type', error);
        alert('Error updating operation type');
      }
    );
  }

  // Method to handle operation type delete
  //(click)="deactivateOperationType(operationType.name)"
    deactivateOperationType(operationTypeName: string): void {
    const confirmation = window.confirm(`Are you sure you want to deactivate the operation type: ${operationTypeName}?`);
    if (confirmation) {
      this.operationTypeService.deactivateOperationTypeByName(operationTypeName).subscribe(
        (response) => {
          const operationType = this.operationTypes.find(op => op.name === operationTypeName);
          if (operationType) {
            operationType.isDeactivated = true;  // Mark the operation type as deactivated
            alert('Operation type deactivated successfully');
          }
        },
        (error) => {
          console.error("Error deactivating operation type:", error);
        }
      );
    }
  }

  activateOperationType(operationTypeName: string): void {
    const confirmation = window.confirm(`Are you sure you want to activate the operation type: ${operationTypeName}?`);
    if (confirmation) {
      this.operationTypeService.activateOperationTypeByName(operationTypeName).subscribe(
        (response) => {
          const operationType = this.operationTypes.find(op => op.name === operationTypeName);
          if (operationType) {
            operationType.isDeactivated = false;  // Mark the operation type as activated
            alert('Operation type activated successfully');
          }
        },
        (error) => {
          console.error("Error activating operation type:", error);
        }
      );
    }
  }
  


 
  
}
