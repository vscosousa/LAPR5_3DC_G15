import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { SearchStaffsComponent } from './search-staffs.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { StaffService } from '../../Services/staff-sevice.service';

describe('SearchStaffsComponent', () => {
  let component: SearchStaffsComponent;
  let fixture: ComponentFixture<SearchStaffsComponent>;
  let mockStaffService: any;

  beforeEach(async () => {
    mockStaffService = {
      getAllStaffs: jasmine.createSpy('getAllStaffs').and.returnValue(of([
        {
          availabilitySlots: [],
          email: 'admin@email.com',
          firstName: 'Admin',
          fullName: 'Admin Admin',
          id: '089d21ad-4ccd-43a0-8ee4-8348c830e98d',
          isActive: true,
          lastName: 'Admin',
          licenseNumber: '120241000001',
          phoneNumber: '+3512345678',
          specializationId: 'c8c1c313-df67-447c-8550-3dc9b3bd063a',
          staffType: 'Admin'
        },
        {
          availabilitySlots: [],
          email: 'teste@email.com',
          firstName: 'Teste',
          fullName: 'Teste Teste',
          id: '089d21ad-4ccd-43a0-8ee4-8348c830e98d',
          isActive: true,
          lastName: 'Admin',
          licenseNumber: '1202410000021',
          phoneNumber: '+3512345672228',
          specializationId: 'c8c1c313-df67-447c-8550-3dc9b3bd032a',
          staffType: 'Admin'
        }
      ])),
      searchStaffProfiles: jasmine.createSpy('searchStaffProfiles').and.returnValue(of([
        {
          availabilitySlots: [],
          email: 'teste@email.com',
          firstName: 'Teste',
          fullName: 'Teste Teste',
          id: '089d21ad-4ccd-43a0-8ee4-8348c830e98d',
          isActive: true,
          lastName: 'Admin',
          licenseNumber: '1202410000021',
          phoneNumber: '+3512345672228',
          specializationId: 'c8c1c313-df67-447c-8550-3dc9b3bd032a',
          staffType: 'Admin'
        }
      ])),
      getSpecialization: jasmine.createSpy('getSpecialization').and.returnValue(of([
        { id: 1, specOption: "Cardiology" },
        { id: 2, specOption: "Dermatology" },
        { id: 3, specOption: "Endocrinology" }
      ]))
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, SearchStaffsComponent, SidebarComponent],
      providers: [
        { provide: StaffService, useValue: mockStaffService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchStaffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Mock window.alert
    window.alert = jasmine.createSpy('alert');
    console.error = jasmine.createSpy('error');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch all staffs on init', () => {
    component.ngOnInit();
    expect(mockStaffService.getAllStaffs).toHaveBeenCalled();
    expect(component.staffProfiles).toEqual([
      {
        availabilitySlots: [],
        email: 'admin@email.com',
        firstName: 'Admin',
        fullName: 'Admin Admin',
        id: '089d21ad-4ccd-43a0-8ee4-8348c830e98d',
        isActive: true,
        lastName: 'Admin',
        licenseNumber: '120241000001',
        phoneNumber: '+3512345678',
        specializationId: 'c8c1c313-df67-447c-8550-3dc9b3bd063a',
        staffType: 'Admin'
      },
      {
        availabilitySlots: [],
        email: 'teste@email.com',
        firstName: 'Teste',
        fullName: 'Teste Teste',
        id: '089d21ad-4ccd-43a0-8ee4-8348c830e98d',
        isActive: true,
        lastName: 'Admin',
        licenseNumber: '1202410000021',
        phoneNumber: '+3512345672228',
        specializationId: 'c8c1c313-df67-447c-8550-3dc9b3bd032a',
        staffType: 'Admin'
      }
    ]);
  });

  it('should fetch specializations on init', () => {
    component.ngOnInit();
    expect(mockStaffService.getSpecialization).toHaveBeenCalled();
    expect(component.specializations).toEqual([
      { id: 1, specOption: "Cardiology" },
      { id: 2, specOption: "Dermatology" },
      { id: 3, specOption: "Endocrinology" }
    ]);
  });

  it('should search staffs', () => {
    component.searchForm.setValue({
      firstName: 'Test',
      lastName: 'Staff',
      fullName: 'Test Staff',
      email: 'test@example.com',
      specializationName: 'Cardiology'
    });

    component.onSearch();
    expect(mockStaffService.searchStaffProfiles).toHaveBeenCalledWith({
      firstName: 'Test',
      lastName: 'Staff',
      fullName: 'Test Staff',
      email: 'test@example.com',
      specializationName: 'Cardiology'
    });
    expect(component.staffProfiles).toEqual([
      {
        availabilitySlots: [],
        email: 'teste@email.com',
        firstName: 'Teste',
        fullName: 'Teste Teste',
        id: '089d21ad-4ccd-43a0-8ee4-8348c830e98d',
        isActive: true,
        lastName: 'Admin',
        licenseNumber: '1202410000021',
        phoneNumber: '+3512345672228',
        specializationId: 'c8c1c313-df67-447c-8550-3dc9b3bd032a',
        staffType: 'Admin'
      }
    ]);
  });

  /*it('should handle error when searching staffs', () => {
    mockStaffService.searchStaffProfiles.and.returnValue(throwError({ status: 400, error: { message: 'Search failed' } }));
    component.searchForm.setValue({
      firstName: 'Test',
      lastName: 'Staff',
      fullName: 'Test Staff',
      email: 'test@example.com',
      specializationName: 'Cardiology'
    });

    component.onSearch();
    expect(mockStaffService.searchStaffProfiles).toHaveBeenCalledWith({
      firstName: 'Test',
      lastName: 'Staff',
      fullName: 'Test Staff',
      email: 'test@example.com',
      specializationName: 'Cardiology'
    });
    expect(window.alert).toHaveBeenCalledWith('Search failed');
  });*/

  it('should clear the form', () => {
    component.searchForm.setValue({
      firstName: 'Test',
      lastName: 'Staff',
      fullName: 'Test Staff',
      email: 'test@example.com',
      specializationName: 'Cardiology'
    });

    component.clearFilters();
    expect(component.searchForm.value).toEqual({
      firstName: '',
      lastName: '',
      fullName: '',
      email: '',
      specializationName: ''
    });
  });
});