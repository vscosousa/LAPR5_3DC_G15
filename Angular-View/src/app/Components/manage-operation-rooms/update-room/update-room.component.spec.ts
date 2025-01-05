import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UpdateRoomComponent } from './update-room.component';
import { RoomService } from '../../../Services/room.service';
import { of, throwError } from 'rxjs';

describe('UpdateRoomComponent', () => {
  let component: UpdateRoomComponent;
  let fixture: ComponentFixture<UpdateRoomComponent>;
  let roomService: RoomService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UpdateRoomComponent], // Import the standalone component and HttpClientTestingModule
      providers: [RoomService] // Provide the RoomService
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateRoomComponent);
    component = fixture.componentInstance;
    roomService = TestBed.inject(RoomService);
    component.room = { id: 'R123', name: 'Room 1', type: 'Type A', description: 'Description 1' }; // Provide necessary input data
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update room successfully', () => {
    spyOn(roomService, 'updateRoom').and.returnValue(of({}));
    spyOn(window, 'alert');
    spyOn(component.roomUpdated, 'emit');

    component.onSubmit();

    expect(roomService.updateRoom).toHaveBeenCalledWith('R123', component.room);
    expect(window.alert).toHaveBeenCalledWith('Room updated successfully!');
    expect(component.roomUpdated.emit).toHaveBeenCalled();
  });

  it('should handle error while updating room', () => {
    spyOn(roomService, 'updateRoom').and.returnValue(throwError('Error'));
    spyOn(window, 'alert');
    spyOn(console, 'error');

    component.onSubmit();

    expect(roomService.updateRoom).toHaveBeenCalledWith('R123', component.room);
    expect(console.error).toHaveBeenCalledWith('Error updating room:', 'Error');
    expect(window.alert).toHaveBeenCalledWith('Failed to update room.');
  });
});