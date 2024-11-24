import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HttpResponse } from '@angular/common/http';
import { StaffService } from './staff-sevice.service';

describe('StaffService', () => {
  let service: StaffService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StaffService]
    });
    service = TestBed.inject(StaffService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call createStaff and return a HttpResponse', () => {
    const newStaff = {
      firstName: 'Teste',
      lastName: 'Admin',
      fullName: 'Teste Teste',  
      phoneNumber: '+3512345672228',
      email: 'teste@email.com',
      staffType: 'Admin',
      specializationName: 'Cardiology'
    };
    const mockResponse = new HttpResponse({ status: 201, statusText: 'Created', body: 'Staff created successfully' });
  
    service.createStaff(newStaff).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
  
    const req = httpMock.expectOne(`${service['apiUrl']}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newStaff);
    req.event(mockResponse);
  });

  it('should call getAllStaffs and return an array of staffs', () => {
    const mockStaffs = [
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
    ];

    service.getAllStaffs().subscribe(staffs => {
      expect(staffs).toEqual(mockStaffs);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStaffs);
  });

  it('should call getSpecialization and return an array of specializations', () => {
    const mockSpecializations = [
      { id: '12332', specOption: 'Cardiology' },
      { id: '21312', specOption: 'Neurology' }
    ];
  
    service.getSpecialization().subscribe(specializations => {
      expect(specializations).toEqual(mockSpecializations);
    });
  
    const req = httpMock.expectOne(`${service['apiURLSpecializaction']}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSpecializations);
  });
  
  it('should call getStaffTypes and return an array of staff types', () => {
    const mockStaffTypes = ['Doctor', 'Nurse', 'Admin'];
  
    service.getStaffTypes().subscribe(staffTypes => {
      expect(staffTypes).toEqual(mockStaffTypes);
    });
  
    const req = httpMock.expectOne(`${service['apiUrl']}/staff-types`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStaffTypes);
  });

  it('should call confirmUpdates and return a response', () => {
    const updateData = { phoneNumber: '+1234567890', email: 'test@example.com', token: 'test-token' };
    const mockResponse = { status: 'success' };
   
    service.confirmUpdates(updateData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req => req.url === `${service['apiUrl']}/ConfirmUpdates` && req.params.has('phoneNumber') && req.params.has('email') && req.params.has('token'));
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should call activateStaff and return a HttpResponse', () => {
    const userInfo = { email: 'test@example.com', username: 'testuser', staffType: 'Doctor', staffId: '1130b0d0-0821-4370-9936-a2899b577663' };
    const mockResponse = new HttpResponse({ status: 200 });

    service.activateStaff(userInfo).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiURLUser']}/RegisterUser`);
    expect(req.request.method).toBe('POST');
    req.event(mockResponse);
  });

  it('should call activateUser and return a response', () => {
    const token = 'test-token';
    const newPassword = 'new-password';
    const mockResponse = { status: 'success' };

    service.activateUser(token, newPassword).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req => req.url === `${service['apiURLUser']}/Activate` && req.params.has('token') && req.params.has('newPassword'));
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should call searchStaffProfiles and return an array of staff profiles', () => {
    const criteria = { firstName: 'Afosno', lastName: 'Cruz', fullName: 'Afonso Cruz', email: 'teste.afonso@example.com', specializationName: 'Cardiology' };
    const mockStaffProfiles = [{ firstName: 'Afosno', lastName: 'Cruz', fullName: 'Afonso Cruz', email: 'teste.afonso@example.com', specializationName: 'Cardiology' }];

    service.searchStaffProfiles(criteria).subscribe(staffProfiles => {
      expect(staffProfiles).toEqual(mockStaffProfiles);
    });

    const req = httpMock.expectOne(req => req.url === `${service['apiUrl']}/search` && req.params.has('firstName') && req.params.has('lastName') && req.params.has('fullName') && req.params.has('email') && req.params.has('specializationName'));
    expect(req.request.method).toBe('GET');
    req.flush(mockStaffProfiles);
  });

  it('should call getStaffById and return a staff', () => {
    const mockStaff = {
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
    };

    service.getStaffById('089d21ad-4ccd-43a0-8ee4-8348c830e98d').subscribe(staff => {
      expect(staff).toEqual(mockStaff);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/089d21ad-4ccd-43a0-8ee4-8348c830e98d`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStaff);
  });

  it('should call updateStaff and return an updated staff', () => {
    const updateData = {
      phoneNumber: '+3512345672228',
      email: 'updated@email.com',
      addAvailabilitySlots:'',
      removeAvailabilitySlots:'',
      specializationName: 'Cardiology'
    };
    const mockResponse = { ...updateData, id: '089d21ad-4ccd-43a0-8ee4-8348c830e98d' };

    service.updateStaff('089d21ad-4ccd-43a0-8ee4-8348c830e98d', updateData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/089d21ad-4ccd-43a0-8ee4-8348c830e98d`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);
    req.flush(mockResponse);
  });

  it('should call deactivateStaff and return a response', () => {
    const mockResponse = { status: 'success' };

    service.deactivateStaff('089d21ad-4ccd-43a0-8ee4-8348c830e98d').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/deactivate/089d21ad-4ccd-43a0-8ee4-8348c830e98d`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });
});