import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOperationTypeComponent } from './create-operation-type.component';

describe('CreateOperationTypeComponent', () => {
  let component: CreateOperationTypeComponent;
  let fixture: ComponentFixture<CreateOperationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOperationTypeComponent]
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
