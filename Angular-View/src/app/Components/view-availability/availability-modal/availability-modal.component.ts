import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { error } from 'console';

@Component({
  selector: 'app-availability-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './availability-modal.component.html',
  styleUrl: './availability-modal.component.scss'
})

export class AvailabilityModalComponent {
  @Output() availabilitySelected = new EventEmitter<string>();
  @Output() closeModal = new EventEmitter<void>();
  availabilityForm: FormGroup;
  errorMessage: string = '';
  hours: string[] = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  constructor(private fb: FormBuilder) {
    this.availabilityForm = this.fb.group({
      date: ['', Validators.required],
      selectedHours: this.fb.array(this.hours.map(hour => this.fb.control(false)), this.minSelectedCheckboxes(1))
    });
  }

  minSelectedCheckboxes(min: number) {
    const validator = (formArray: any) => {
      const totalSelected = formArray.controls
        .map((control: any) => control.value)
        .reduce((prev: number, next: boolean) => next ? prev + 1 : prev, 0);
      return totalSelected >= min ? null : { required: true };
    };
    return validator;
  }

  onSubmit(): void {
    if (this.availabilityForm.invalid) {
      console.log("Form invalid");  
      this.errorMessage = 'Please select one day and at least one hour';
      return;
    }
    
    const date = this.availabilityForm.value.date;
    const selectedHours = this.availabilityForm.value.selectedHours
      .map((checked: boolean, i: number) => checked ? this.hours[i] : null)
      .filter((v: string | null) => v !== null);

    const availabilityString = selectedHours.map((hour: string) => `${date} ${hour}`).join(',');
    console.log("availabilityString", availabilityString);
    this.availabilitySelected.emit(availabilityString);
  }

  onModalClick(event: MouseEvent): void {
    this.closeModal.emit();
  }
}