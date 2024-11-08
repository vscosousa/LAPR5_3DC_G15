import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule to access ngFor
import { RouterModule } from '@angular/router';
import { OperationTypeService } from '../../services/operation-type.service';

@Component({
  selector: 'app-operation-types',
  standalone: true,  // Ensuring this is a standalone component
  imports: [CommonModule, RouterModule],  // Add CommonModule here
  templateUrl: './operation-types.component.html',
  styleUrls: ['./operation-types.component.scss']
})
export class OperationTypesComponent implements OnInit {
  operationTypes: any[] = [];
  staffs: any[] = [];

  visibleSpecializations = new Map<number, boolean>();

  constructor(private operationTypeService: OperationTypeService) { }

  ngOnInit(): void { 
    this.fetchOperationTypes();
  }

  fetchOperationTypes(): void{
    this.operationTypeService.getOperationTypes().subscribe(
      (data: any[]) => {
        this.operationTypes = data;
        this.staffs = data.map(operationType => operationType.staffs);
      },
      error => {
        console.error('Error fetching operation types', error);
      }
    );
  }
}
