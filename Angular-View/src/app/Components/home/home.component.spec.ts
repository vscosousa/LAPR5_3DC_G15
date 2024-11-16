import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HomeComponent } from './home.component';

// Test suite for HomeComponent
// Author: Vasco Sousa (1221700)
// Last Updated: 06/11/2024

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a login button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const loginButton = compiled.querySelector('a[href="login"]');
    expect(loginButton).toBeTruthy();
    expect(loginButton?.textContent).toContain('Login');
  });

  it('should have a register button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const registerButton = compiled.querySelector('a[href="register"]');
    expect(registerButton).toBeTruthy();
    expect(registerButton?.textContent).toContain('Register');
  });

  it('should have an articles section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const articlesSection = compiled.querySelector('.articles-container');
    expect(articlesSection).toBeTruthy();
    expect(articlesSection?.querySelector('h1')?.textContent).toContain('Health & Wellness Articles');
  });

  it('should have a footer', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const footer = compiled.querySelector('.footer');
    expect(footer).toBeTruthy();
  });
});
