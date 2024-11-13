import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HomeComponent } from './home.component';

// Test suite for HomeComponent
// Author: Vasco Sousa (1221700)
// Last Updated: 05/11/2024

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    // Set up the testing module for HomeComponent
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HomeComponent]
    })
    .compileComponents();

    // Create the component and trigger change detection
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test to check if the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
