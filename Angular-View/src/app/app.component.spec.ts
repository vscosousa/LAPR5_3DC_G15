import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

// Test suite for AppComponent
// Author: Vasco Sousa (1221700)
// Last Updated: 06/11/2024

describe('AppComponent', () => {
  beforeEach(async () => {
    // Set up the testing module for AppComponent
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  // Test to check if the component is created successfully
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // Test to check if the title is set correctly
  it(`should have the 'Angular-View' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Angular-View');
  });
});
