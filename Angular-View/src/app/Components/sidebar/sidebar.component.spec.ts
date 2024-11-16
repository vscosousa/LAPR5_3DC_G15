import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarComponent } from './sidebar.component';
import { PanelService } from '../../Services/panel.service';
import { SettingsService } from '../../Services/settings.service';
import { of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn()
}));

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let panelServiceMock: jest.Mocked<PanelService>;
  let settingsServiceMock: jest.Mocked<SettingsService>;

  beforeEach(async () => {
    panelServiceMock = {
      panelId$: of('test-panel-id')
    } as any;

    settingsServiceMock = {
      settingsId$: of('test-settings-id')
    } as any;

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, SidebarComponent],
      providers: [
        { provide: PanelService, useValue: panelServiceMock },
        { provide: SettingsService, useValue: settingsServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize panelId and settingsId', () => {
    expect(component.panelId).toBe('test-panel-id');
    expect(component.settingsId).toBe('test-settings-id');
  });

  it('should decode token and set name and role', () => {
    const mockToken = 'mock-token';
    const mockDecodedToken = {
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'Test User',
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'Admin'
    };
    localStorage.setItem('token', mockToken);
    (jwtDecode as jest.Mock).mockReturnValue(mockDecodedToken);

    component.ngOnInit();

    expect(component.name).toBe('Test User');
    expect(component.role).toBe('Admin');
  });

  it('should handle logout', () => {
    localStorage.setItem('token', 'mock-token');
    component.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
