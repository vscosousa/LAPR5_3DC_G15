/**
 * US 6.2.4 - As an admin, I want to log in to the system
 * US Developed By: João Pereira - 1211503
 * Finished at 09/11/2024
 *
 * Test suite for the LoginComponent.
 * 
 * @testSuite
 * @class LoginComponentTest
 * 
 * @method beforeEach Sets up the test environment for each test.
 * @method it('should create') Tests if the component is created successfully.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
