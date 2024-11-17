import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { RegisterService } from '../../Services/register.service';
import { ReactiveFormsModule } from '@angular/forms';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let registerServiceMock: jest.Mocked<RegisterService>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    const mockRegisterService = {
      register: jest.fn().mockReturnValue(of({}))
    };

    activatedRouteMock = {
      queryParams: of({ token: 'mockToken' })
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, RegisterComponent],
      providers: [
        { provide: RegisterService, useValue: mockRegisterService },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    registerServiceMock = TestBed.inject(RegisterService) as jest.Mocked<RegisterService>;
    fixture.detectChanges();

    window.alert = jest.fn();
    console.error = jest.fn();
    console.log = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    component.togglePasswordVisibility('password');
    expect(component.passwordFieldType).toBe('text');
    component.togglePasswordVisibility('password');
    expect(component.passwordFieldType).toBe('password');
  });

  it('should toggle confirm password visibility', () => {
    component.togglePasswordVisibility('confirm-password');
    expect(component.confirmPasswordFieldType).toBe('text');
    component.togglePasswordVisibility('confirm-password');
    expect(component.confirmPasswordFieldType).toBe('password');
  });

  it('should not submit form if invalid', () => {
    component.registerForm.controls['email'].setValue('');
    component.onSubmit();
    expect(component.registerForm.invalid).toBeTruthy();
  });

  it('should alert if passwords do not match', () => {
    component.registerForm.controls['email'].setValue('test@example.com');
    component.registerForm.controls['identifier'].setValue('12345');
    component.registerForm.controls['phoneNumber'].setValue('1234567890');
    component.registerForm.controls['password'].setValue('password123');
    component.registerForm.controls['confirmPassword'].setValue('password456');
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('Passwords do not match');
  });

  it('should call register service on valid form submission', () => {
    component.registerForm.controls['email'].setValue('test@example.com');
    component.registerForm.controls['identifier'].setValue('12345');
    component.registerForm.controls['phoneNumber'].setValue('1234567890');
    component.registerForm.controls['password'].setValue('password123');
    component.registerForm.controls['confirmPassword'].setValue('password123');
    component.onSubmit();
    expect(registerServiceMock.register).toHaveBeenCalledWith('test@example.com', '12345', '1234567890', 'password123');
  });

  it('should handle registration failure', () => {
    registerServiceMock.register.mockReturnValueOnce(throwError({ error: 'Registration failed' }));
    component.registerForm.controls['email'].setValue('test@example.com');
    component.registerForm.controls['identifier'].setValue('12345');
    component.registerForm.controls['phoneNumber'].setValue('1234567890');
    component.registerForm.controls['password'].setValue('password123');
    component.registerForm.controls['confirmPassword'].setValue('password123');
    component.onSubmit();
    expect(console.error).toHaveBeenCalledWith('Registration failed', { error: 'Registration failed' });
    expect(window.alert).toHaveBeenCalledWith('Registration failed - Registration failed');
  });
});
