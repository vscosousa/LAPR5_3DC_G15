import { TestBed } from '@angular/core/testing';
import { PanelService } from './panel.service';
import { take } from 'rxjs/operators';

// Test suite for PanelService
// Author: Vasco Sousa (1221700)
// Last Updated: 09/11/2024

describe('PanelService', () => {
  let service: PanelService;

  beforeEach(() => {
    // Set up the testing module for PanelService
    TestBed.configureTestingModule({});
    service = TestBed.inject(PanelService);
  });

  // Test to check if the service is created successfully
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test to check if the default panel ID is 'default-panel'
  it('should have default panel ID as "default-panel"', (done) => {
    service.panelId$.pipe(take(1)).subscribe(panelId => {
      expect(panelId).toBe('default-panel');
      done();
    });
  });

  // Test to check if setPanelId updates the panel ID
  it('should update the panel ID', (done) => {
    const newPanelId = 'new-panel-id';
    service.setPanelId(newPanelId);
    service.panelId$.pipe(take(1)).subscribe(panelId => {
      expect(panelId).toBe(newPanelId);
      done();
    });
  });
});
