/**
 * US 6.2.15 - As a Doctor, I want to update an operation requisition, so that the Patient has
 * access to the necessary healthcare.
 * US Developed By: Tiago Sousa - 1150736`
 *
 * Finished at [24/11/2024]
 * Component for updating an operation requisition.
 */

import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { OperationRequestService } from '../../../Services/operation-request.service';
import { PanelService } from '../../../Services/panel.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-update-operation-request',
  standalone: true,
  imports: [FormsModule, SidebarComponent, RouterModule, CommonModule],
  styleUrls: ['./update-operation-request.component.scss'],
  templateUrl: './update-operation-request.component.html',
})

export class UpdateOperationRequestComponent implements OnInit {
  existingOperationRequest = {
    priority: '',
    deadlineDate: ''
  };

  constructor(
    private operationRequestService: OperationRequestService,
    private router: Router,
    private panelService: PanelService
  ) { }

  ngOnInit() {
    this.panelService.setPanelId('panel-admin');
    const operationRequestId = this.extractOperationRequestFromUrl();
    this.getOperationRequest(operationRequestId);
  }

  getOperationRequest(id: string) {
    this.operationRequestService.getOperationRequests().subscribe(
      operationRequests => {
        console.log('Operation requests fetched:', operationRequests);
        const operationRequest = operationRequests.find(req => req.id === id);
        if (operationRequest) {
          this.existingOperationRequest = {
            ...operationRequest,
            deadlineDate: this.formatDate(operationRequest.deadlineDate)
          };
          console.log('Operation request fetched:', operationRequest);
        } else {
          console.error('Operation request not found with id:', id);
        }
      },
      error => {
        console.error('Error fetching operation request', error);
      }
    );
  }


  updateOperationRequest(event: Event) {
    event.preventDefault();

    const today = new Date();
    const selectedDate = new Date(this.existingOperationRequest.deadlineDate);

    if (selectedDate <= today) {
      alert("The deadline date must be higher than today.");
      return;
    }

    const operationRequest = this.extractOperationRequestFromUrl();
    console.log('Updating operation request:', operationRequest);
    this.operationRequestService.editOperationRequest(operationRequest, this.existingOperationRequest).subscribe(
      response => {
        console.log('Operation request updated successfully:', response);
        alert("Operation request updated successfully!");
        this.router.navigate(['/manage-patients']);
      },
      error => {
        console.error('Error updating operation request:', error);
        alert("Error updating operation request: " + JSON.stringify(error));
      }
    );
  }


  extractOperationRequestFromUrl() {
    const url = window.location.href;
    const regex = /\/update-operation-request\/([0-9a-fA-F-]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1];
    } else {
      throw new Error('Operation Request not found in URL.');
    }
  }

  formatDate(dateString: string): string {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  }

  clearForm() {
    this.existingOperationRequest = {
      priority: '',
      deadlineDate: '',
    };
  }
}
