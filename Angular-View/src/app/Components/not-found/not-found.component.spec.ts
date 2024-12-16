import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFoundComponent } from './not-found.component';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

// Test suite for NotFoundComponent
// Author: Vasco Sousa (1221700)
// Last Updated: 06/11/2024

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    // Set up the testing module for NotFoundComponent
    await TestBed.configureTestingModule({
      imports: [RouterModule, NotFoundComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({}) } }
      ]
    })
    .compileComponents();

    // Create the component and trigger change detection
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a 404 image', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const image = compiled.querySelector('img[alt="Page not found image"]');
    expect(image).toBeTruthy();
  });

  it('should have a link to the home page', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const homeLink = compiled.querySelector('a[routerLink="/"]');
    expect(homeLink).toBeTruthy();
    expect(homeLink?.textContent).toContain('Go to Home Page');
  });
});
