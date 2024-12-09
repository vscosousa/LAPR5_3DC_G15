import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageAllergiesAndConditionsComponent } from './manage-allergies-and-conditions.component';

describe('ManageAllergiesAndConditionsComponent', () => {
  let component: ManageAllergiesAndConditionsComponent;
  let fixture: ComponentFixture<ManageAllergiesAndConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageAllergiesAndConditionsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageAllergiesAndConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
