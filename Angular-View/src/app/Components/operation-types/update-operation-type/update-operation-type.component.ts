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

        // Populate the specializations FormArray
        const specializationsArray = this.updateForm.get('specializations') as FormArray;
        data.specializations.forEach((specOption: string) => {
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
