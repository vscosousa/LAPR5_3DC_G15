import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DeleteUserComponent } from './delete-user.component';
import { DeleteUserService } from '../../Services/delete-user.service';

describe('DeleteUserComponent', () => {
  let component: DeleteUserComponent;
  let fixture: ComponentFixture<DeleteUserComponent>;
  let deleteUserServiceMock: jest.Mocked<DeleteUserService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    const mockDeleteUserService = {
      deleteAccount: jest.fn().mockReturnValue(of({}))
    };
    const mockRouter = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, DeleteUserComponent],
      providers: [
        { provide: DeleteUserService, useValue: mockDeleteUserService },
        { provide: Router, useValue: mockRouter }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DeleteUserComponent);
    component = fixture.componentInstance;
    deleteUserServiceMock = TestBed.inject(DeleteUserService) as jest.Mocked<DeleteUserService>;
    routerMock = TestBed.inject(Router) as jest.Mocked<Router>;
    fixture.detectChanges();

    // Mock window.alert
    window.alert = jest.fn();
    console.error = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delete user account successfully', () => {
    const token = 'sample-token';
    const urlSearchParamsMock = jest.fn().mockImplementation(() => ({
      get: jest.fn().mockReturnValue(token)
    }));
    (global as any).URLSearchParams = urlSearchParamsMock;

    component.onDelete();

    expect(deleteUserServiceMock.deleteAccount).toHaveBeenCalledWith(token);
    expect(window.alert).toHaveBeenCalledWith('Your account has been successfully deleted.');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle error when deleteAccount fails', () => {
    const token = 'sample-token';
    const urlSearchParamsMock = jest.fn().mockImplementation(() => ({
      get: jest.fn().mockReturnValue(token)
    }));
    (global as any).URLSearchParams = urlSearchParamsMock;

    const errorResponse = { error: 'Error deleting account' };
    deleteUserServiceMock.deleteAccount.mockReturnValueOnce(throwError(errorResponse));

    component.onDelete();

    expect(deleteUserServiceMock.deleteAccount).toHaveBeenCalledWith(token);
    expect(window.alert).toHaveBeenCalledWith('Account deletion failed - ' + errorResponse.error);
  });

  it('should alert user if token is not present in URL', () => {
    const urlSearchParamsMock = jest.fn().mockImplementation(() => ({
      get: jest.fn().mockReturnValue(null)
    }));
    (global as any).URLSearchParams = urlSearchParamsMock;

    component.onDelete();

    expect(deleteUserServiceMock.deleteAccount).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Invalid token. Account deletion failed.');
  });

  it('should navigate to home and alert user when cancel is clicked', () => {
    component.onCancel();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    expect(window.alert).toHaveBeenCalledWith('Account deletion cancelled.');
  });
});
