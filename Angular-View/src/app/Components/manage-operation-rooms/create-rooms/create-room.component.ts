import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../../Services/room.service';

@Component({
  selector: 'app-create-room',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent {

  room: {
    name: string,
    type: string,
    description: string
  } = {
    name: '',
    type: '',
    description: ''
  };

  @Output() roomCreated = new EventEmitter<void>();

  constructor(
    private roomService: RoomService,
  ) {}

  onSubmit(): void {
    this.roomService.createRoom(this.room).subscribe({
      next: () => {
        alert('Room created successfully!');
        this.roomCreated.emit();
      },
      error: (err: any) => {
        console.error('Error creating room:', err);
        alert('Failed to create room.');
      }
    });
  }
}