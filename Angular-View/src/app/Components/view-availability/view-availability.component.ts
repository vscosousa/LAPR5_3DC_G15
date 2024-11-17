import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarEvent, CalendarView, CalendarModule, CalendarUtils, DateAdapter as CalendarDateAdapter, CalendarA11y, CalendarDateFormatter, CalendarEventTitleFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { parse, isValid, addWeeks, subWeeks, addHours } from 'date-fns';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { StaffService } from '../../Services/staff-sevice.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvailabilityModalComponent } from './availability-modal/availability-modal.component';

@Component({
  selector: 'app-view-availability',
  standalone: true,
  imports: [FormsModule, CommonModule, SidebarComponent, AvailabilityModalComponent, CalendarModule, ReactiveFormsModule, RouterModule],
  templateUrl: './view-availability.component.html',
  styleUrls: ['./view-availability.component.scss'],
  providers: [
    CalendarUtils,
    CalendarA11y,
    CalendarDateFormatter,
    CalendarEventTitleFormatter,
    {
      provide: CalendarDateAdapter,
      useFactory: adapterFactory,
    }
  ]
})
export class ViewAvailabilityComponent implements OnInit {
  staffId: string = '';
  updateStaffForm: FormGroup;
  staffName: string = '';
  availabilitySlots: string[] = [];
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Week;
  events: CalendarEvent[] = [];
  showAvailabilityModal: boolean = false;
  availabilityType: string = '';
  errorMessage: string = '';

  constructor( private staffService: StaffService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.updateStaffForm = this.fb.group({
      identifier: [''],
      phoneNumber: [''],
      email: [''],
      addAvailabilitySlots: [''],
      removeAvailabilitySlots: [''],
      specializationName: ['']
    });
    this.staffId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.loadStaffDetails();
    console.log("ViewAvailabilityComponent initialized with staffId:", this.staffId);
  }

  loadStaffDetails(): void {
    this.staffService.getStaffById(this.staffId).subscribe({
      next: (data) => {
        this.staffName = data.fullName;
        this.availabilitySlots = data.availabilitySlots;
        this.populateEvents();
        console.log("Staff details:\n", data);
        console.log("Availability slots:\n", this.availabilitySlots);
      },
      error: (error) => {
        console.error('Error Get Staff to Update', error);
        alert('Error Get Staff to Update' + error.error );
      }
    });
  }

  populateEvents(): void {
    this.events = this.availabilitySlots.map(slot => {
      const date = parse(slot, 'dd/MM/yyyy HH:mm:ss', new Date());
      if (isValid(date)) {
        return {
          start: date,
          end: addHours(date, 1),
          title: 'Available',
          color: { primary: '#1e90ff', secondary: '#D1E8FF' },
        } as CalendarEvent;
      }
      return null;
    }).filter((event): event is CalendarEvent => event !== null);
  }

  previousWeek(): void {
    this.viewDate = subWeeks(this.viewDate, 1);
  }

  nextWeek(): void {
    this.viewDate = addWeeks(this.viewDate, 1);
  }

  dayClicked(event: { date: Date; events: CalendarEvent[] }): void {
    console.log('Day clicked:', event.date, event.events);
    // Adicione aqui a lógica para lidar com a seleção de datas, se necessário
  }

  openAvailabilityModal(type: string): void {
    this.availabilityType = type;
    this.showAvailabilityModal = true;
  }

  closeAvailabilityModal(): void {
    this.showAvailabilityModal = false;
  }

  onAvailabilitySelected(availabilityString: string): void {
    if (this.availabilityType === 'add') {
      this.updateStaffForm.patchValue({ addAvailabilitySlots: availabilityString });
      this.SubmitAvailabilitySlots();
      this.loadStaffDetails();
    } else if (this.availabilityType === 'remove') {
      this.updateStaffForm.patchValue({ removeAvailabilitySlots: availabilityString });
      this.SubmitAvailabilitySlots();
      this.loadStaffDetails();
    }
    this.showAvailabilityModal = false;
  }

  SubmitAvailabilitySlots(): void {
    const updateData = {
      phoneNumber:  '',
      email: '',
      addAvailabilitySlots: this.updateStaffForm.value.addAvailabilitySlots?.trim() || '',
      removeAvailabilitySlots: this.updateStaffForm.value.removeAvailabilitySlots?.trim() || '',
      specializationName: ''
    };
    
    if (Object.values(updateData).every(value => !value)) {
      this.errorMessage='Please select availability slots to add or remove';
      return;
    }

    console.log("Update Avaliability Slots:\n", updateData);
    this.staffService.updateStaff(this.staffId, updateData).subscribe({
      next: () => {
          console.log('Staff Updated Successfully');
          this.errorMessage = '';
          this.closeAvailabilityModal();
        },
        error: (error) => {
          console.error('Error Updating staff', error);
          if (error.status === 400) {
            const errorResponse = error.error;
            this.errorMessage =  errorResponse.message;
          } else {
            alert('Create Updating failed - ' + error.error);
          }
        }
    });
  }

}