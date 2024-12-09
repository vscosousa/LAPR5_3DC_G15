import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DoctorPanelComponent } from './doctor-panel.component';
import { SettingsService } from '../../Services/settings.service'; // Adjust the import path as necessary
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('DoctorPanelComponent', () => {
  let component: DoctorPanelComponent;
  let fixture: ComponentFixture<DoctorPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, DoctorPanelComponent], // Import the standalone component and HttpClientTestingModule
      providers: [
        SettingsService,
        { provide: ActivatedRoute, useValue: { params: of({ id: '123' }) } } // Provide the ActivatedRoute with a mock value
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
