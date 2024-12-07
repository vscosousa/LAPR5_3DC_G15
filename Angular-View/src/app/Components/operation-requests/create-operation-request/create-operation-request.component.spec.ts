import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreateOperationRequestComponent } from './create-operation-request.component';
import { OperationRequestService } from '../../../Services/operation-request.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('CreateOperationRequestComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CreateOperationRequestComponent], // Import the standalone component
      providers: [
        OperationRequestService,
        { provide: ActivatedRoute, useValue: { params: of({ id: 'test-id' }) } } // Provide a mock ActivatedRoute
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CreateOperationRequestComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
