/**
 * US 6.2.19 - As an admin, I want to update an operation type
 * US Developed By: João Pereira - 1211503
 * Finished at 11/11/2024
 * Component for updating an operation type and managing its specializations.
 * 
 * @component
 * @selector app-update-operation-type
 * @standalone true
 * @imports [FormsModule, ReactiveFormsModule, RouterModule, SidebarComponent, CommonModule]
 * 
 * @class UpdateOperationTypeComponent
 * @implements OnInit
 * 
 * @method ngOnInit Initializes the component and fetches the operation type data.
 * @method loadOperationType Loads the operation type data from the backend.
 * @method updateOperationType Updates the operation type with the form data.
 * @method specializations Getter for the specializations FormArray.
 * @method addSpecialization Adds a new specialization to the FormArray.
 * @method removeSpecialization Removes a specialization from the FormArray.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { OperationTypeService } from '../../../Services/operation-type.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-operation-type',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule, SidebarComponent, CommonModule],
  templateUrl: './update-operation-type.component.html',
  styleUrls: ['./update-operation-type.component.scss']
})
export class UpdateOperationTypeComponent implements OnInit {
  updateForm!: FormGroup;
  operationTypeName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private operationTypeService: OperationTypeService
  ) { }

  ngOnInit(): void {
    this.updateForm = this.fb.group({
      name: [''],
      estimatedDuration: [''],
      specializations: this.fb.array([], Validators.required),
    });

    this.operationTypeName = this.route.snapshot.paramMap.get('name')!;
    this.loadOperationType();
  }

  // Load the operation type data from backend
  loadOperationType(): void {
    this.operationTypeService.getOperationTypeByName(this.operationTypeName).subscribe(
      (data: any) => {
        this.updateForm.patchValue({
          name: data.name,
          estimatedDuration: data.estimatedDuration
        });

        // Populate the specializations FormArray with only the specOption values
        const specializationsArray = this.updateForm.get('specializations') as FormArray;
        const specOptions = data.specializations.map((spec: any) => spec.specOption); // Map to extract specOption
        specOptions.forEach((specOption: string) => {
          specializationsArray.push(this.fb.control(specOption, Validators.required));
        });
      },
      error => {
        console.error('Error fetching operation type', error);
      }
    );
  }

  // Update method
  updateOperationType(): void {
    if (this.updateForm.valid) {
      const formValue = this.updateForm.value;
      const operationTypeData = {
        name: formValue.name,
        estimatedDuration: formValue.estimatedDuration,
        specializations: formValue.specializations, // Array of strings
      };

      this.operationTypeService.editOperationType(this.operationTypeName, operationTypeData).subscribe(
        () => {
          alert('Operation type updated successfully');
          this.router.navigate(['/operation-types']);
        },
        error => {
          console.error('Error updating operation type', error);
        }
      );
    }
  }

  // Specializations FormArray helper methods
  get specializations(): FormArray {
    return this.updateForm.get('specializations') as FormArray;
  }
  addSpecialization(): void {
    this.specializations.push(this.fb.control('', Validators.required));
  }
  removeSpecialization(index: number): void {
    this.specializations.removeAt(index);
  }
}