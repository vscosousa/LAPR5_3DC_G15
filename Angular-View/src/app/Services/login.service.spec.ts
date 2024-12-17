import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginService } from './login.service';
import { HttpResponse } from '@angular/common/http';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService]
    });
    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log in a user', () => {
    const email = 'test@example.com';
    const password = 'password123';
    const mockResponse = new HttpResponse({ body: 'mock-jwt-token', status: 200 });

    service.login(email, password).subscribe(response => {
      expect(response.body).toBe('mock-jwt-token');
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email, password });
    req.event(mockResponse);
  });

  it('should extract role from token', () => {
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiJ9.abc123';
    const role = service.getRoleFromToken(mockToken);
    expect(role).toBe('Admin');
  });

  it('should send token to backend', () => {
    const token = 'mock-google-token';
    const mockResponse = new HttpResponse({ body: 'success', status: 200 });

    service.sendTokenToBackend(token).subscribe(response => {
      expect(response.body).toBe('success');
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/Google`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ token });
    expect(req.request.headers.get('X-Skip-Interceptor')).toBe('true');
    req.event(mockResponse);
  });
});
