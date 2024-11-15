import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ConfirmUpdatesStaffComponent } from './confirm-updates-staff.component';
import { StaffService } from '../../Services/staff-sevice.service';

describe('ConfirmUpdatesStaffComponent', () => {
  let component: ConfirmUpdatesStaffComponent;
  let fixture: ComponentFixture<ConfirmUpdatesStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ConfirmUpdatesStaffComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' }),
            queryParams: of({ phoneNumber: '1234567890', email: 'test@example.com', token: 'abc123' })
          }
        },
        StaffService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmUpdatesStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
