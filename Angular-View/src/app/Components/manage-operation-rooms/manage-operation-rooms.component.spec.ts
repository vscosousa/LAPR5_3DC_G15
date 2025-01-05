import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Renderer2 } from '@angular/core';
import { ManageOperationRoomsComponent } from './manage-operation-rooms.component';
import { RoomService } from '../../Services/room.service';
import { PanelService } from '../../Services/panel.service';

describe('ManageOperationRoomsComponent', () => {
  let component: ManageOperationRoomsComponent;
  let fixture: ComponentFixture<ManageOperationRoomsComponent>;
  let roomService: RoomService;
  let renderer: Renderer2;
  let panelService: PanelService;

  beforeEach(async () => {
    const rendererMock = {
      addClass: jest.fn(),
      removeClass: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ManageOperationRoomsComponent], // Import the standalone component
      providers: [
        RoomService,
        { provide: Renderer2, useValue: rendererMock },
        PanelService,
        { provide: ActivatedRoute, useValue: { params: of({ id: '123' }) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageOperationRoomsComponent);
    component = fixture.componentInstance;
    roomService = TestBed.inject(RoomService);
    renderer = TestBed.inject(Renderer2);
    panelService = TestBed.inject(PanelService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch rooms on init', () => {
    jest.spyOn(component, 'fetchRooms');
    component.ngOnInit();
    expect(component.fetchRooms).toHaveBeenCalled();
  });

  it('should open modal and navigate to the correct route', () => {
    jest.spyOn(component['router'], 'navigate');

    component.openModal('create-room');

    expect(component.modalType).toBe('create-room');
    expect(component['router'].navigate).toHaveBeenCalledWith(['/manage-operation-rooms/create-room']);
  });

  it('should close modal and reset state', () => {
    jest.spyOn(component['router'], 'navigate');
    jest.spyOn(component, 'refreshPage');

    component.closeModal();

    expect(component.modalType).toBeNull();
    expect(component.selectedItem).toBeNull();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/manage-operation-rooms']);
    expect(component.refreshPage).toHaveBeenCalled();
  });

  it('should fetch rooms successfully', async () => {
    const mockRooms = [{ id: '1', name: 'Room 1', type: 'Type A', description: 'Description 1' }];
    jest.spyOn(roomService, 'getRooms').mockReturnValue(of(mockRooms as any));

    component.fetchRooms();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(roomService.getRooms).toHaveBeenCalled();
    expect(component.rooms).toEqual(mockRooms);
  });

  it('should handle error while fetching rooms', () => {
    jest.spyOn(roomService, 'getRooms').mockReturnValue(throwError('Error'));
    jest.spyOn(console, 'error').mockImplementation(() => {});
  
    component.fetchRooms();
  
    expect(roomService.getRooms).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error fetching rooms:', 'Error');
  });
  
  it('should handle room created event', () => {
    jest.spyOn(component, 'closeModal');
    component.handleRoomCreated();
    expect(component.closeModal).toHaveBeenCalled();
  });

  it('should handle room updated event', () => {
    jest.spyOn(component, 'closeModal');
    component.handleRoomUpdated();
    expect(component.closeModal).toHaveBeenCalled();
  });

  it('should refresh page by fetching rooms', () => {
    jest.spyOn(component, 'fetchRooms');

    component.refreshPage();

    expect(component.fetchRooms).toHaveBeenCalled();
  });
});