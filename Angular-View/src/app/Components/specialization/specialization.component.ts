import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SpecializationService } from '../../Services/specialization.service';
import { Router } from '@angular/router';
import { CreateSpecializationComponent } from './create-specialization/create-specialization.component';
import { UpdateSpecializationComponent } from './update-specialization/update-specialization.component';

export interface Specialization {
  id: string;
  specializationType: string;
}

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
  specializations: Specialization[] = [];
  isModalOpen = false;
  isUpdateModalOpen = false;
  selectedSpecializationId!: string;

  constructor(private specializationService: SpecializationService, private router: Router) {}

  ngOnInit(): void {
    this.fetchSpecializations();
  }

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

  openCreateSpecialization() {
    this.isModalOpen = true;
    this.router.navigate(['specializations/create-specialization']);
  }

  closeModal(event?: Event) {
    if (event) event.stopPropagation();
    this.isModalOpen = false;
    this.router.navigate(['specializations']);
  }

  openUpdateSpecialization(id: string) {
    this.selectedSpecializationId = id;
    this.isUpdateModalOpen = true;
    this.router.navigate(['specializations/update-specialization', id]);
  }

  closeUpdateModal(event?: Event) {
    if (event) event.stopPropagation();
    this.isUpdateModalOpen = false;
  
    this.router.navigate(['specializations']);
  }

  refreshSpecializations() {
    this.fetchSpecializations();
    this.closeModal();
    this.closeUpdateModal();
  }

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

  viewSpecializationDetails(id: string): void {
    console.log(`Viewing specialization details for ID: ${id}`);
    // Implement view logic here
  }
}