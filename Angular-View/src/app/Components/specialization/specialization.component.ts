/**
 * US 7.2.15 - As an Admin, I want to list/search Specializations.
 * 
 * US Developed By: João Pereira - 1211503
 * Finished at 06/12/2024
 *
 * Component for managing specializations.
 * 
 * @class SpecializationComponent
 * @implements OnInit
 * 
 * @method ngOnInit Initializes the component and fetches specializations.
 * @method fetchSpecializations Fetches all specializations from the service.
 * @method openCreateSpecialization Opens the modal to create a new specialization.
 * @method closeModal Closes the create specialization modal.
 * @method openUpdateSpecialization Opens the modal to update an existing specialization.
 * @method closeUpdateModal Closes the update specialization modal.
 * @method refreshSpecializations Refreshes the list of specializations.
 * @method deleteSpecialization Deletes a specialization.
 * @method viewSpecializationDetails Views details of a specific specialization.
 */

import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SpecializationService } from '../../Services/specialization.service';
import { Router } from '@angular/router';
import { CreateSpecializationComponent } from './create-specialization/create-specialization.component';
import { UpdateSpecializationComponent } from './update-specialization/update-specialization.component';

// Interface representing a specialization
export interface Specialization {
  id: string;
  specializationType: string;
}

// Interface representing the API response
interface ApiResponse<T> {
  isSuccess: boolean;
  isFailure: boolean;
  error: string | null;
  _value: T;
}

@Component({
  selector: 'app-specialization',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, CreateSpecializationComponent, UpdateSpecializationComponent],
  templateUrl: './specialization.component.html',
  styleUrls: ['./specialization.component.scss'],
})
export class SpecializationComponent implements OnInit {
  // Array to hold the list of specializations
  specializations: Specialization[] = [];
  // Boolean to control the visibility of the create modal
  isModalOpen = false;
  // Boolean to control the visibility of the update modal
  isUpdateModalOpen = false;
  // Variable to hold the ID of the selected specialization for update
  selectedSpecializationId!: string;

  // Constructor to inject the necessary services
  constructor(private specializationService: SpecializationService, private router: Router) {}

  // Lifecycle hook that runs when the component is initialized
  ngOnInit(): void {
    this.fetchSpecializations();
  }

  // Method to fetch the list of specializations from the API
  fetchSpecializations(): void {
    this.specializationService.getSpecializations().subscribe({
      next: (data: ApiResponse<Specialization[]>) => {
        console.log('API Response:', data);
        if (data.isSuccess && Array.isArray(data._value)) {
          this.specializations = data._value;
          console.log('Specializations:', this.specializations);
        } else {
          this.specializations = [];
          console.error('Unexpected API response format:', data);
        }
      },
      error: (err) => {
        console.error('Error fetching specializations:', err);
      },
    });
  }

  // Method to open the create specialization modal
  openCreateSpecialization() {
    this.isModalOpen = true;
    this.router.navigate(['specializations/create-specialization']);
  }

  // Method to close the create specialization modal
  closeModal(event?: Event) {
    if (event) event.stopPropagation();
    this.isModalOpen = false;
    this.router.navigate(['specializations']);
  }

  // Method to open the update specialization modal
  openUpdateSpecialization(id: string) {
    this.selectedSpecializationId = id;
    this.isUpdateModalOpen = true;
    this.router.navigate(['specializations/update-specialization', id]);
  }

  // Method to close the update specialization modal
  closeUpdateModal(event?: Event) {
    if (event) event.stopPropagation();
    this.isUpdateModalOpen = false;
    this.router.navigate(['specializations']);
  }

  // Method to refresh the list of specializations
  refreshSpecializations() {
    this.fetchSpecializations();
    this.closeModal();
    this.closeUpdateModal();
  }

  // Method to delete a specialization
  deleteSpecialization(id: string, specializationType: string) {
    if (confirm(`Are you sure you want to delete the specialization "${specializationType}"?`)) {
      this.specializationService.deleteSpecialization(id).subscribe({
        next: () => {
          alert('Specialization deleted successfully!');
          this.refreshSpecializations();
        },
        error: (err) => {
          console.error('Error deleting specialization:', err);
          alert('Failed to delete specialization.');
        },
      });
    }
  }

  // Method to view details of a specific specialization
  viewSpecializationDetails(id: string): void {
    console.log(`Viewing specialization details for ID: ${id}`);
    // Implement view logic here
  }
}