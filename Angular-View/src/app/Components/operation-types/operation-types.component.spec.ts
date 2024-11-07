import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OperationTypesComponent } from './operation-types.component';

describe('OperationTypesComponent', () => {
  let component: OperationTypesComponent;
  let fixture: ComponentFixture<OperationTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationTypesComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}) // Mock any required parameters here
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});