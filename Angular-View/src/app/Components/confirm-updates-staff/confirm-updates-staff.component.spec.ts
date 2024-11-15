import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmUpdatesStaffComponent } from './confirm-updates-staff.component';

describe('ConfirmUpdatesStaffComponent', () => {
  let component: ConfirmUpdatesStaffComponent;
  let fixture: ComponentFixture<ConfirmUpdatesStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmUpdatesStaffComponent]
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
