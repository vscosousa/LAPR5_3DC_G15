import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hospital3dComponent } from './hospital3d.component';

describe('Hospital3dComponent', () => {
  let component: Hospital3dComponent;
  let fixture: ComponentFixture<Hospital3dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hospital3dComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Hospital3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
