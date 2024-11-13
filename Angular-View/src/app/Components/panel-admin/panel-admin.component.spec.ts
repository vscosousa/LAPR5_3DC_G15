import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PanelAdminComponent } from './panel-admin.component';

describe('PanelAdminComponent', () => {
  let component: PanelAdminComponent;
  let fixture: ComponentFixture<PanelAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PanelAdminComponent],
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

    fixture = TestBed.createComponent(PanelAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
