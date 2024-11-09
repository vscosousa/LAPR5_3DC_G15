import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { CreateOperationTypeComponent } from './create-operation-type.component';
import { OperationTypeService } from '../../../Services/operation-type.service'; // Import the service

describe('CreateOperationTypeComponent', () => {
  let component: CreateOperationTypeComponent;
  let fixture: ComponentFixture<CreateOperationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreateOperationTypeComponent,
        HttpClientModule // Add HttpClientModule here
      ],
      providers: [
        OperationTypeService, // Provide the service
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({})
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOperationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});