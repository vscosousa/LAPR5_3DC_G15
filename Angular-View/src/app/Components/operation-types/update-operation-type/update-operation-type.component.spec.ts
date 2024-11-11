import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateOperationTypeComponent } from './update-operation-type.component';
import { OperationTypeService } from '../../../Services/operation-type.service';

describe('UpdateOperationTypeComponent', () => {
  let component: UpdateOperationTypeComponent;
  let fixture: ComponentFixture<UpdateOperationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ReactiveFormsModule,
        UpdateOperationTypeComponent
      ],
      providers: [
        OperationTypeService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (name: string) => 'Cardiology Operation'
              }
            }
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