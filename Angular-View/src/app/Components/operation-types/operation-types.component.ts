import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule to access ngFor
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-operation-types',
  standalone: true,  // Ensuring this is a standalone component
  imports: [CommonModule, RouterModule],  // Add CommonModule here
  templateUrl: './operation-types.component.html',
  styleUrls: ['./operation-types.component.scss']
})
export class OperationTypesComponent implements OnInit {
  operationTypes = [
    { id: 1, name: 'Type 1', estimatedTime: '1 hour', specializations: ['Spec 1', 'Spec 2'] },
    { id: 2, name: 'Type 2', estimatedTime: '2 hours', specializations: ['Spec 3', 'Spec 4'] }
  ];

  visibleSpecializations = new Map<number, boolean>();

  constructor() { }

  ngOnInit(): void { }
}
