import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { PanelService } from '../../Services/panel.service';
import { RoomService } from '../../Services/room.service';
import { CreateRoomComponent } from "./create-rooms/create-room.component";
import { UpdateRoomComponent } from "./update-room/update-room.component";

@Component({
  selector: 'app-manage-operation-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarComponent, CreateRoomComponent, UpdateRoomComponent],
  templateUrl: './manage-operation-rooms.component.html',
  styleUrls: ['./manage-operation-rooms.component.scss']
})
export class ManageOperationRoomsComponent {
  modalType: string | null = null;
  rooms: { name: string; type: string; description: string; }[] = [];
  selectedItem: any = null;

  constructor(private renderer: Renderer2, private router: Router, private panelService: PanelService, private roomService: RoomService) { }

  ngOnInit(): void {
    this.panelService.setPanelId('panel-admin');
    this.fetchRooms();
  }

  openModal(type: string): void {
    this.modalType = type;
    this.renderer.addClass(document.body, 'modal-active');
    this.router.navigate([`/manage-operation-rooms/${type}`]);
  }

  closeModal(): void {
    this.modalType = null;
    this.selectedItem = null;
    this.renderer.removeClass(document.body, 'modal-active');
    this.router.navigate(['/manage-operation-rooms']);
    this.refreshPage();
  }

  openDetailsModal(room: any): void {
    this.selectedItem = room;
    this.modalType = 'details';
    this.renderer.addClass(document.body, 'modal-active');
  }

  openUpdateModal(room: any): void {
    this.selectedItem = room;
    this.modalType = 'update-room';
    this.renderer.addClass(document.body, 'modal-active');
    this.router.navigate([`/manage-operation-rooms/update-room`]);
  }

  fetchRooms(): void {
    this.roomService.getRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
      },
      error: (err) => {
        console.error('Error fetching rooms:', err);
      }
    });
  }

  refreshPage(): void {
    this.fetchRooms();
  }

  handleRoomCreated(): void {
    this.closeModal();
    this.fetchRooms();
  }

  handleRoomUpdated(): void {
    this.closeModal();
    this.fetchRooms();
  }
}