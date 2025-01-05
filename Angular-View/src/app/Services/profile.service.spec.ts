/**
 * @fileoverview ProfileService Test Suite
 * @description Test suite for the ProfileService.
 * 
 * @class ProfileService
 * @description Service to handle profile-related API requests.
 * 
 * @method should be created
 * @description Verifies that the ProfileService is created successfully.
 * 
 * @date 22/12/2024
 * @autor Vasco Sousa (1221700)
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ProfileService]
    });
    service = TestBed.inject(ProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
