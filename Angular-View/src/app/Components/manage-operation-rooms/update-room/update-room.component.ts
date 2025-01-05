import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../../Services/room.service';

@Component({
  selector: 'app-update-room',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-room.component.html',
  styleUrls: ['./update-room.component.scss']
})
export class UpdateRoomComponent {

  @Input() room: any;

  @Output() roomUpdated = new EventEmitter<void>();

  constructor(
    private roomService: RoomService,
  ) {}

  onSubmit(): void {
    const roomId = this.room.id;
    console.log('Room:', this.room);
    console.log('Room ID:', roomId);
    this.roomService.updateRoom(roomId, this.room).subscribe({
      next: () => {
        alert('Room updated successfully!');
        this.roomUpdated.emit();
      },
      error: (err: any) => {
        console.error('Error updating room:', err);
        alert('Failed to update room.');
      }
    });
  }
}