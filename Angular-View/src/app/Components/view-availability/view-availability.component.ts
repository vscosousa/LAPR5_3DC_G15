import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarEvent, CalendarView, CalendarModule, CalendarUtils, DateAdapter as CalendarDateAdapter, CalendarA11y, CalendarDateFormatter, CalendarEventTitleFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { parse, isValid, addWeeks, subWeeks, addHours } from 'date-fns';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { StaffService } from '../../Services/staff-sevice.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-view-availability',
  standalone: true,
  imports: [FormsModule, CommonModule, SidebarComponent, CalendarModule, ReactiveFormsModule, RouterModule],
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
  availabilityForm: FormGroup;  
  staffName: string = '';
  availabilitySlots: string[] = [];
  viewDate: Date = new Date();
  today: string ='';
  view: CalendarView = CalendarView.Week;
  events: CalendarEvent[] = [];
  showEditAvailability: boolean = false;
  availabilityType: string = '';
  errorMessage: string = '';
  hours: string[] = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  addAvailabilitySlots: string = '';
  removeAvailabilitySlots: string = '';

  constructor( private staffService: StaffService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.availabilityForm = this.fb.group({
      date: [''],
      selectedHours: this.fb.array(this.hours.map(() => this.fb.control(false)))
    });
  
    this.staffId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.staffId) {
      alert('Staff ID not found in the route');
    }
  }

  ngOnInit(): void {
    this.loadStaffDetails();
  }

  loadStaffDetails(): void {
    this.staffService.getStaffById(this.staffId).subscribe({
      next: (data) => {
        this.staffName = data.fullName;
        this.availabilitySlots = data.availabilitySlots;
        this.populateEvents();
      },
      error: (error) => {
        console.error('Error Get Staff to Update', error);
        if (error.status === 401){
          alert('Unauthorized page access');
        } else {
          alert('Error loading staff details');
        }
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
          color: { primary: '#1e90ff', secondary: '#D1E8FF' }
        } as CalendarEvent;
      }
      return null;
    }).filter((event): event is CalendarEvent => event !== null);
  }

  initFromUpdate(): void {
    const today = new Date();
    this.today = today.toISOString().split('T')[0];
    this.availabilityForm.patchValue({ date: this.today });
    this.onUpdateDateChange({ target: { value: this.today } });
  }

  previousWeek(): void {
    this.viewDate = subWeeks(this.viewDate, 1);
  }

  nextWeek(): void {
    this.viewDate = addWeeks(this.viewDate, 1);
  }

  onDateChange(event: any) {
    this.viewDate = new Date(event.target.value);
  }

  toggleEditAvailability() {
    this.showEditAvailability = !this.showEditAvailability;
    this.initFromUpdate();
  }

  formatDateString(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  onUpdateDateChange(event: any) {
    const selectedDate = this.formatDateString(event.target.value);
    // Reset all checkboxes
    this.availabilityForm.setControl('selectedHours', this.fb.array(this.hours.map(() => this.fb.control(false))));
    // Check if the selected date matches any availability slot
    this.availabilitySlots.forEach(slot => {
      const [slotDate, slotTime] = slot.split(' ');
      if (slotDate === selectedDate) {
        const hourIndex = this.hours.indexOf(slotTime.slice(0, 5));        
        if (hourIndex !== -1) {
          (this.availabilityForm.get('selectedHours') as FormArray).at(hourIndex).setValue(true);
        }
      }
    });
  }
  
  onSubmit(): void {
    
    if (this.availabilityForm.value.date === '') {
      this.errorMessage = 'Please select a date';
      return;
    }

    const date = this.availabilityForm.value.date;
    const selectedHours = this.availabilityForm.value.selectedHours
      .map((checked: boolean, i: number) => checked ? this.hours[i] : null)
      .filter((v: string | null) => v !== null);
    
    const unselectedHours = this.availabilityForm.value.selectedHours
      .map((checked: boolean, i: number) => !checked ? this.hours[i] : null)
      .filter((v: string | null) => v !== null);

    const addAvailabilityString = selectedHours.map((hour: string) => `${date} ${hour}`).join(',');
    const removeAvailabilityString = unselectedHours.map((hour: string) => `${date} ${hour}`).join(',');

    if (addAvailabilityString === this.addAvailabilitySlots && removeAvailabilityString === this.removeAvailabilitySlots) {
      this.errorMessage = 'No changes detected in availability slots';
      return;
    }

    this.addAvailabilitySlots = addAvailabilityString;
    this.removeAvailabilitySlots = removeAvailabilityString;
    this.SubmitAvailabilitySlots();
  }
  
  SubmitAvailabilitySlots(): void {
    const updateData = {
      phoneNumber:  '',
      email: '',
      addAvailabilitySlots: this.addAvailabilitySlots,
      removeAvailabilitySlots: this.removeAvailabilitySlots,
      specializationName: ''
    };

    this.staffService.updateStaff(this.staffId, updateData).subscribe({
      next: () => {
          console.log('Staff Updated Successfully');
          this.errorMessage = '';
          this.loadStaffDetails();
        },
        error: (error) => {
          console.error('Error Updating staff', error);
          console.error('Error status', error.status);
          if (error.status === 400) {
            const errorResponse = error.error;
            this.errorMessage =  errorResponse.message;
          } else if (error.status === 401){
            alert('Unauthorized page access');
          } else {
            alert('Updating failed - ' + error.error);
          }
        }
    });
  } 
}