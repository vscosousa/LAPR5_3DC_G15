import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SettingsService } from './settings.service';
import { HttpResponse } from '@angular/common/http';
import { take } from 'rxjs/operators';

// Test suite for SettingsService
// Author: Vasco Sousa (1221700)
// Last Updated: 09/11/2024

describe('SettingsService', () => {
  let service: SettingsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Set up the testing module for SettingsService
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(SettingsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Test to check if the service is created successfully
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test to check if the default settings ID is 'default-settings'
  it('should have default settings ID as "default-settings"', (done) => {
    service.settingsId$.pipe(take(1)).subscribe(settingsId => {
      expect(settingsId).toBe('default-settings');
      done();
    });
  });

  // Test to check if setSettingsId updates the settings ID
  it('should update the settings ID', (done) => {
    const newSettingsId = 'new-settings-id';
    service.setSettingsId(newSettingsId);
    service.settingsId$.pipe(take(1)).subscribe(settingsId => {
      expect(settingsId).toBe(newSettingsId);
      done();
    });
  });

  // Test to check if deleteAccount makes the correct HTTP request
  it('should call deleteAccount and return a HttpResponse', () => {
    const token = 'test-token';
    const mockResponse = new HttpResponse({ status: 200 });

    service.deleteAccount(token).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/RequestDelete`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(JSON.stringify(token));
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.event(mockResponse);
  });
});
