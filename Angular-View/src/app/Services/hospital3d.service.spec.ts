import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Hospital3dService } from './hospital3d.service';

describe('Hospital3dService', () => {
  let service: Hospital3dService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Hospital3dService]
    });
    service = TestBed.inject(Hospital3dService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch rooms availability by date', () => {
    const mockRoomsAvailability = [{ roomId: '1', available: true }];
    const date = '2023-10-10';

    service.getRoomsAvailabilityByDate(date).subscribe(roomsAvailability => {
      expect(roomsAvailability).toEqual(mockRoomsAvailability);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}?date=2023-10-10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRoomsAvailability);
  });
});
