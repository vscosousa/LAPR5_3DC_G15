import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MedicalHistoryService } from './medical-history.service';

describe('MedicalHistoryService', () => {
  let service: MedicalHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Import HttpClientTestingModule
      providers: [MedicalHistoryService] // Provide the MedicalHistoryService
    });
    service = TestBed.inject(MedicalHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
