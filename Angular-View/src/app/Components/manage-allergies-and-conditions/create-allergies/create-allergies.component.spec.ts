import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAllergiesComponent } from './create-allergies.component';

describe('CreateAllergiesComponent', () => {
  let component: CreateAllergiesComponent;
  let fixture: ComponentFixture<CreateAllergiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAllergiesComponent] // Import the standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAllergiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
