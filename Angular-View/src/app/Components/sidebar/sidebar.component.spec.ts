import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarComponent } from './sidebar.component';
import { SettingsService } from '../../Services/settings.service';

// Test suite for SidebarComponent
// Author: Vasco Sousa (1221700)
// Last Updated: 11/11/2024

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    // Set up the testing module for SidebarComponent
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, SidebarComponent],
      providers: [SettingsService]
    })
    .compileComponents();

    // Create the component and trigger change detection
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test to check if the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
