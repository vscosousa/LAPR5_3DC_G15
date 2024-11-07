import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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
    estimatedTime: '',
    specializations: [] as string[]
  };

  availableSpecializations = [
    'Cardiology',
    'Orthopedics',
    'Neurology',
    'Pediatrics',
    'Dermatology',
    'General Surgery'
  ];

  constructor(private router: Router) { }

  onSubmit() {
  }

  onCancel() {
    this.router.navigate(['/operationTypes']);
  }
}