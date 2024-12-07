import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AllergyService } from './allergy.service';

describe('AllergyService', () => {
  let service: AllergyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Add this line
      providers: [AllergyService] // Provide the service
    });
    service = TestBed.inject(AllergyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
