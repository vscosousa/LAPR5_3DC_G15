import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RoomService } from './room.service';

describe('RoomService', () => {
  let service: RoomService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RoomService]
    });
    service = TestBed.inject(RoomService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch rooms', () => {
    const mockRooms = [
      { name: 'Room 1', type: 'Type A', description: 'Description 1' }
    ];

    service.getRooms().subscribe(rooms => {
      expect(rooms).toEqual(mockRooms);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRooms);
  });

  it('should handle error while fetching rooms', () => {
    service.getRooms().subscribe(
      rooms => {
        expect(rooms).toEqual([]);
      },
      () => fail('should have succeeded with an empty array')
    );

    const req = httpMock.expectOne(`${service['apiUrl']}`);
    expect(req.request.method).toBe('GET');
    req.flush('Error fetching rooms', { status: 500, statusText: 'Server Error' });
  });

  it('should create a room', () => {
    const newRoom = {
      name: 'Room 1',
      type: 'Type A',
      description: 'Description 1'
    };

    service.createRoom(newRoom).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/create`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should handle error while creating a room', () => {
    const newRoom = {
      name: 'Room 1',
      type: 'Type A',
      description: 'Description 1'
    };

    service.createRoom(newRoom).subscribe(
      () => fail('should have failed with the error'),
      (error) => {
        expect(error.message).toBe('Failed to create room. Please try again later.');
      }
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/create`);
    expect(req.request.method).toBe('POST');
    req.flush('Error creating room', { status: 500, statusText: 'Server Error' });
  });

  it('should update a room', () => {
    const updatedRoom = {
      name: 'Room 1',
      type: 'Type A',
      description: 'Description 1'
    };

    service.updateRoom('1', updatedRoom).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/update/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should handle error while updating a room', () => {
    const updatedRoom = {
      name: 'Room 1',
      type: 'Type A',
      description: 'Description 1'
    };

    service.updateRoom('1', updatedRoom).subscribe(
      () => fail('should have failed with the error'),
      (error) => {
        expect(error.message).toBe('Failed to update room. Please try again later.');
      }
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/update/1`);
    expect(req.request.method).toBe('PUT');
    req.flush('Error updating room', { status: 500, statusText: 'Server Error' });
  });
});