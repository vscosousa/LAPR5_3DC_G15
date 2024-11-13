import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DeleteUserComponent } from './delete-user.component';
import { DeleteUserService } from '../../Services/delete-user.service';

// Test suite for DeleteUserComponent
// Author: Vasco Sousa (1221700)
// Last Updated: 12/11/2024

describe('DeleteUserComponent', () => {
  let component: DeleteUserComponent;
  let fixture: ComponentFixture<DeleteUserComponent>;

  beforeEach(async () => {
    // Set up the testing module for DeleteUserComponent
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, DeleteUserComponent],
      providers: [DeleteUserService]
    })
    .compileComponents();

    // Create the component and trigger change detection
    fixture = TestBed.createComponent(DeleteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test to check if the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
