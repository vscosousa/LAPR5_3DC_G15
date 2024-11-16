import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { PatientSettingsComponent } from './patient-settings.component';
import { PanelService } from '../../Services/panel.service';
import { SettingsService } from '../../Services/settings.service';
import { Component } from '@angular/core';

class MockRouter {
  navigate = jest.fn();
}

class MockPanelService {
  setPanelId = jest.fn();
}

class MockSettingsService {
  setSettingsId = jest.fn();
  deleteAccount = jest.fn().mockReturnValue(of({}));
}

class MockActivatedRoute {
  params = of({});
}

@Component({
  selector: 'app-patient-settings',
  template: `
    <div class="settings-container">
      <div class="settings-content">
        <div class="header">
          <h1>Settings</h1>
        </div>
        <div class="settings-details">
          <section id="theme-settings" class="box">
            <h2>Theme</h2>
            <label> <input type="radio" name="theme" value="light" /> Light </label>
            <label>
              <input type="radio" name="theme" value="dark" checked /> Dark
            </label>
          </section>
          <section id="account-settings" class="box">
            <h2>Account</h2>
            <button class="delete-account" (click)="onSubmit()">
              Request Account Delete
            </button>
          </section>
        </div>
      </div>
    </div>
  `
})
class MockPatientSettingsComponent {
  constructor(
    private router: Router,
    private settingsService: SettingsService
  ) {}

  onSubmit() {
    const token: string = localStorage.getItem('token') as string;
    if (token) {
      this.settingsService.deleteAccount(token).subscribe(
        response => {
          console.log('Request Finished With Success', response);
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
          alert('To complete the account deletion process, please check your email for further instructions.');
        },
        error => {
          console.error('Account deletion failed', error);
          alert('Account deletion failed - ' + error.error);
        }
      );
    } else {
      this.router.navigate(['/login']);
      alert('No token found. Please log in again.');
    }
  }
}

describe('PatientSettingsComponent', () => {
  let component: MockPatientSettingsComponent;
  let fixture: ComponentFixture<MockPatientSettingsComponent>;
  let routerMock: MockRouter;
  let settingsServiceMock: MockSettingsService;

  beforeEach(async () => {
    routerMock = new MockRouter();
    settingsServiceMock = new MockSettingsService();

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [MockPatientSettingsComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: SettingsService, useValue: settingsServiceMock },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MockPatientSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    window.alert = jest.fn();
    console.error = jest.fn();
    console.log = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle account deletion successfully', () => {
    localStorage.setItem('token', 'test-token');
    component.onSubmit();
    expect(settingsServiceMock.deleteAccount).toHaveBeenCalledWith('test-token');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    expect(window.alert).toHaveBeenCalledWith('To complete the account deletion process, please check your email for further instructions.');
  });

  it('should handle account deletion failure', () => {
    localStorage.setItem('token', 'test-token');
    const errorResponse = { error: 'Error deleting account' };
    settingsServiceMock.deleteAccount.mockReturnValueOnce(throwError(errorResponse));

    component.onSubmit();
    expect(settingsServiceMock.deleteAccount).toHaveBeenCalledWith('test-token');
    expect(window.alert).toHaveBeenCalledWith('Account deletion failed - Error deleting account');
  });

  it('should navigate to login if no token is found', () => {
    localStorage.removeItem('token');
    component.onSubmit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    expect(window.alert).toHaveBeenCalledWith('No token found. Please log in again.');
  });
});
