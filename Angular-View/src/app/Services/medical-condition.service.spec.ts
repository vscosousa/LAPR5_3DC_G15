import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MedicalConditionService } from './medical-condition.service';

describe('MedicalConditionService', () => {
  let service: MedicalConditionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Add this line
      providers: [MedicalConditionService] // Add this line
    });
    service = TestBed.inject(MedicalConditionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
