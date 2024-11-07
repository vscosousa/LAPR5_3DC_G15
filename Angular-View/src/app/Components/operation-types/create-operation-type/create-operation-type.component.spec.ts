import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CreateOperationTypeComponent } from './create-operation-type.component';

describe('CreateOperationTypeComponent', () => {
  let component: CreateOperationTypeComponent;
  let fixture: ComponentFixture<CreateOperationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOperationTypeComponent],
      providers: [
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