import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatePatientUserComponent } from './activate-patient-user.component';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ActivateUserService } from '../../Services/activate-user.service';

describe('ActivatePatientUserComponent', () => {
  let component: ActivatePatientUserComponent;
  let fixture: ComponentFixture<ActivatePatientUserComponent>;
  let activateUserService: jest.Mocked<ActivateUserService>;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    const activateUserServiceMock = {
      activateAccount: jest.fn()
    };
    const routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ActivatePatientUserComponent],
      providers: [
        { provide: ActivateUserService, useValue: activateUserServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    activateUserService = TestBed.inject(ActivateUserService) as jest.Mocked<ActivateUserService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    fixture = TestBed.createComponent(ActivatePatientUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should activate the user account successfully', () => {
    const mockResponse = new HttpResponse({ status: 200 });
    const token = 'sample-token';
    const urlSearchParamsMock = jest.fn().mockImplementation(() => ({
      get: jest.fn().mockReturnValue(token)
    }));
    (global as any).URLSearchParams = urlSearchParamsMock;

    activateUserService.activateAccount.mockReturnValue(of(mockResponse));

    component.onActivate();

    expect(activateUserService.activateAccount).toHaveBeenCalledWith(token);
    expect(window.alert).toHaveBeenCalledWith('Your account has been successfully activated.');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle activation error', () => {
    const errorMessage = 'Activation failed';
    const token = 'sample-token';
    const urlSearchParamsMock = jest.fn().mockImplementation(() => ({
      get: jest.fn().mockReturnValue(token)
    }));
    (global as any).URLSearchParams = urlSearchParamsMock;

    activateUserService.activateAccount.mockReturnValue(throwError({ error: errorMessage }));

    component.onActivate();

    expect(activateUserService.activateAccount).toHaveBeenCalledWith(token);
    expect(window.alert).toHaveBeenCalledWith('Account activation failed - ' + errorMessage);
  });

  it('should alert user if token is not present in URL', () => {
    const urlSearchParamsMock = jest.fn().mockImplementation(() => ({
      get: jest.fn().mockReturnValue(null)
    }));
    (global as any).URLSearchParams = urlSearchParamsMock;

    component.onActivate();

    expect(activateUserService.activateAccount).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Invalid token. Account activation failed.');
  });
});
