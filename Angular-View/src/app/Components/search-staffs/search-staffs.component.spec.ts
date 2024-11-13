import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchStaffsComponent } from './search-staffs.component';
import { StaffService } from '../../Services/staff-sevice.service';

describe('SearchStaffsComponent', () => {
  let component: SearchStaffsComponent;
  let fixture: ComponentFixture<SearchStaffsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, SearchStaffsComponent],
      providers: [StaffService]
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
