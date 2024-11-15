import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { UpdateStaffComponent } from './update-staff.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { StaffService } from '../../Services/staff-sevice.service';
import { ActivatedRoute } from '@angular/router';

describe('UpdateStaffComponent', () => {
  let component: UpdateStaffComponent;
  let fixture: ComponentFixture<UpdateStaffComponent>;
  let mockStaffService: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockStaffService = {
      getSpecialization: jasmine.createSpy('getSpecialization').and.returnValue(of([])),
      updateStaff: jasmine.createSpy('updateStaff').and.returnValue(of({})),
      getStaffById: jasmine.createSpy('getStaffById').and.returnValue(of({}))
    };

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('123')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, UpdateStaffComponent, SidebarComponent],
      providers: [
        { provide: StaffService, useValue: mockStaffService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
