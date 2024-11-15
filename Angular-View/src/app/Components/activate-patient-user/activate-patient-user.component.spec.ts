import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatePatientUserComponent } from './activate-patient-user.component';

describe('ActivatePatientUserComponent', () => {
  let component: ActivatePatientUserComponent;
  let fixture: ComponentFixture<ActivatePatientUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivatePatientUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivatePatientUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
