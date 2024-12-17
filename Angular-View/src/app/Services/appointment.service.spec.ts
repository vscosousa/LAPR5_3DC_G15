import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppointmentService } from './appointment.service';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppointmentService]
    });
    service = TestBed.inject(AppointmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create an appointment', () => {
    const newAppointment = {
      requestId: '123',
      roomId: '1',
      dateTime: '2023-10-10T10:00:00',
      status: 'scheduled',
      team: ['doctor1', 'nurse1']
    };

    service.createAppointment(newAppointment).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/create`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should handle error while creating an appointment', () => {
    const newAppointment = {
      requestId: '123',
      roomId: '1',
      dateTime: '2023-10-10T10:00:00',
      status: 'scheduled',
      team: ['doctor1', 'nurse1']
    };

    service.createAppointment(newAppointment).subscribe(
      () => fail('should have failed with the error'),
      (error) => {
        expect(error.message).toBe('Failed to create appointment. Please try again later.');
      }
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/create`);
    expect(req.request.method).toBe('POST');
    req.flush('Error creating appointment', { status: 500, statusText: 'Server Error' });
  });

  it('should fetch appointments', () => {
    const mockAppointments = [
      { id: '1', requestId: '123', roomId: '1', dateTime: '2023-10-10T10:00:00', status: 'scheduled', team: ['doctor1', 'nurse1'] }
    ];

    service.getAppointments().subscribe(appointments => {
      expect(appointments).toEqual(mockAppointments);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAppointments);
  });

  it('should handle error while fetching appointments', () => {
    service.getAppointments().subscribe(
      () => fail('should have failed with the error'),
      (error) => {
        expect(error.message).toBe('Failed to fetch appointments. Please try again later.');
      }
    );

    const req = httpMock.expectOne(`${service['apiUrl']}`);
    expect(req.request.method).toBe('GET');
    req.flush('Error fetching appointments', { status: 500, statusText: 'Server Error' });
  });

  it('should fetch appointment by id', () => {
    const mockAppointment = { id: '1', requestId: '123', roomId: '1', dateTime: '2023-10-10T10:00:00', status: 'scheduled', team: ['doctor1', 'nurse1'] };

    service.getAppointmentById('1').subscribe(appointment => {
      expect(appointment).toEqual(mockAppointment);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAppointment);
  });

  it('should handle error while fetching appointment by id', () => {
    service.getAppointmentById('1').subscribe(
      () => fail('should have failed with the error'),
      (error) => {
        expect(error.message).toBe('Failed to fetch appointment. Please try again later.');
      }
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush('Error fetching appointment', { status: 500, statusText: 'Server Error' });
  });

  it('should update an appointment', () => {
    const updatedAppointment = { roomId: '1', dateTime: '2023-10-10T10:00:00', team: ['doctor1', 'nurse1'] };

    service.updateAppointment('1', updatedAppointment).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/update/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should handle error while updating an appointment', () => {
    const updatedAppointment = { roomId: '1', dateTime: '2023-10-10T10:00:00', team: ['doctor1', 'nurse1'] };

    service.updateAppointment('1', updatedAppointment).subscribe(
      () => fail('should have failed with the error'),
      (error) => {
        expect(error.message).toBe('Failed to update appointment. Please try again later.');
      }
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/update/1`);
    expect(req.request.method).toBe('PUT');
    req.flush('Error updating appointment', { status: 500, statusText: 'Server Error' });
  });
});
