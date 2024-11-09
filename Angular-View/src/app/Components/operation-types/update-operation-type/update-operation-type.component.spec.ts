/*import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { UpdateOperationTypeComponent } from './update-operation-type.component';
import { OperationTypeService } from '../../../Services/operation-type.service'; // Import the service

describe('UpdateOperationTypeComponent', () => {
  let component: UpdateOperationTypeComponent;
  let fixture: ComponentFixture<UpdateOperationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, // Add HttpClientModule here
        ReactiveFormsModule // Add ReactiveFormsModule here
      ],
      providers: [
        OperationTypeService, // Provide the service
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ name: 'Cardiology Operation' })) // Mock route parameters with ParamMap
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateOperationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
*/