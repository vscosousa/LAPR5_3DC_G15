import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchStaffsComponent } from './search-staffs.component';

describe('SearchStaffsComponent', () => {
  let component: SearchStaffsComponent;
  let fixture: ComponentFixture<SearchStaffsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchStaffsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchStaffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
