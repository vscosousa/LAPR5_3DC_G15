/**
 * US 6.2.20 - As an Admin, I want to remove obsolete or no longer performed operation types
 * US 6.2.21 - As an admin, I want to view all operation types
 * 
 * US Developed By: João Pereira - 1211503 
 * Finished at 11/11/2024
 *
 * Component for managing operation types and their associated staff members.
 * 
 * @component
 * @selector app-operation-types
 * @standalone true
 * @imports [CommonModule, RouterModule, SidebarComponent]
 * 
 * @class OperationTypesComponent
 * @implements OnInit
 * 
 * @method ngOnInit Initializes the component and fetches operation types.
 * @method fetchOperationTypes Fetches all operation types from the service.
 * @method loadStaffForSpecialization Loads staff members for a specific specialization and toggles their visibility.
 * @method toggleStaffVisibility Toggles the visibility of staff members for a specific specialization within a specific operation type.
 * @method isStaffVisible Checks if staff members for a specific specialization within a specific operation type are visible.
 * @method onEdit Handles editing an operation type.
 * @method deactivateOperationType Deactivates an operation type.
 * @method activateOperationType Activates an operation type.
 */
 
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule to access ngFor
import { RouterModule } from '@angular/router';
import { OperationTypeService } from '../../Services/operation-type.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import {PanelService } from '../../Services/panel.service';

@Component({
  selector: 'app-operation-types',
  standalone: true,  // Ensuring this is a standalone component
  imports: [CommonModule, RouterModule, SidebarComponent],  // Add CommonModule here
  templateUrl: './operation-types.component.html',
  styleUrls: ['./operation-types.component.scss']
})
export class OperationTypesComponent implements OnInit {
  operationTypes: any[] = [];
  staffs: { [key: string]: any[] } = {}; // Dictionary to store staff lists by specialization
  visibleStaffs: { [operationTypeName: string]: { [specialization: string]: boolean } } = {}; // Track visibility of each specialization's staff

  constructor(private operationTypeService: OperationTypeService, private panelService:PanelService) { }
  ngOnInit(): void {
    this.fetchOperationTypes();
    this.panelService.setPanelId("panel-admin")
  }

  // Fetch all operation types
  fetchOperationTypes(): void {
    this.operationTypeService.getOperationTypes().subscribe(
      (data: any[]) => {
        this.operationTypes = data;
        console.log('Operation types fetched:', data);
      },
      error => {
        console.error('Error fetching operation types', error);
      }
    );
  }

  // Load staff members for a specific specialization and toggle visibility
  loadStaffForSpecialization(operationTypeName: string, specialization: string): void {
    if (!this.staffs[specialization]) {
      this.operationTypeService.getStaffs(specialization).subscribe({
        next: (data: any[]) => {
          if (Array.isArray(data)) {
            this.staffs[specialization] = data.map(staff => ({
              ...staff,
              fullName: staff.fullName || `${staff.firstName} ${staff.lastName}`
            }));
          }
          this.toggleStaffVisibility(operationTypeName, specialization);
        },
        error: (error) => {
          console.error('Error fetching staff:', error);
          this.staffs[specialization] = [];
        }
      });
    } else {
      this.toggleStaffVisibility(operationTypeName, specialization);
    }
  }

  // Toggle visibility of staff members for a specific specialization within a specific operation type
  toggleStaffVisibility(operationTypeName: string, specialization: string): void {
    if (!this.visibleStaffs[operationTypeName]) {
      this.visibleStaffs[operationTypeName] = {};
    }
    this.visibleStaffs[operationTypeName][specialization] = !this.visibleStaffs[operationTypeName][specialization];
  }

  // Check if staff members for a specific specialization within a specific operation type are visible
  isStaffVisible(operationTypeName: string, specialization: string): boolean {
    return this.visibleStaffs[operationTypeName] && this.visibleStaffs[operationTypeName][specialization];
  }

  // Handle editing an operation type
  onEdit(operationType: any): void {
    console.log('Editing operation type:', operationType);
    this.operationTypeService.editOperationType(operationType.name, operationType).subscribe(
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

  // Deactivate an operation type
  deactivateOperationType(operationTypeName: string): void {
    const confirmation = window.confirm(`Are you sure you want to deactivate the operation type: ${operationTypeName}?`);
    if (confirmation) {
      this.operationTypeService.deactivateOperationTypeByName(operationTypeName).subscribe(
        () => {
          const operationType = this.operationTypes.find(op => op.name === operationTypeName);
          if (operationType) {
            operationType.isDeactivated = true;
            alert('Operation type deactivated successfully');
          }
        },
        error => {
          console.error("Error deactivating operation type:", error);
        }
      );
    }
  }

  // Activate an operation type
  activateOperationType(operationTypeName: string): void {
    const confirmation = window.confirm(`Are you sure you want to activate the operation type: ${operationTypeName}?`);
    if (confirmation) {
      this.operationTypeService.activateOperationTypeByName(operationTypeName).subscribe(
        () => {
          const operationType = this.operationTypes.find(op => op.name === operationTypeName);
          if (operationType) {
            operationType.isDeactivated = false;
            alert('Operation type activated successfully');
          }
        },
        error => {
          console.error("Error activating operation type:", error);
        }
      );
    }
  }
}