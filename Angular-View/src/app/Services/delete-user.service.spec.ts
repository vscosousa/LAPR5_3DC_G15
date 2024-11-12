import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DeleteUserService } from './delete-user.service';

describe('DeleteUserService', () => {
  let service: DeleteUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeleteUserService]
    });
    service = TestBed.inject(DeleteUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
