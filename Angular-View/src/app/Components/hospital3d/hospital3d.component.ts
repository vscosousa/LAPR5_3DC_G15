import { AfterViewInit, Component, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as THREE from "three";
import Orientation from "./Thumb Raiser/orientation";
import ThumbRaiser from "./Thumb Raiser/thumb_raiser_template";
import { FormsModule } from '@angular/forms';
import { Hospital3dService } from '../../Services/hospital3d.service';

@Component({
  selector: 'app-hospital3d',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [Hospital3dService],
  templateUrl: './hospital3d.component.html',
  styleUrls: ['./hospital3d.component.scss']
})
export class Hospital3dComponent implements OnInit, AfterViewInit, OnDestroy {
  thumbRaiser!: ThumbRaiser;
  private animationFrameId: number | null = null;
  selectedDate: Date = new Date(); // Default value for selected date
  firstRooms: any[] = [
    {
      roomNumber: "101",
      type: "Conference",
      capacity: 20,
      equipment: ["Projector", "Whiteboard"],
      isOccupied: false
    },
    {
      roomNumber: "102",
      type: "Meeting",
      capacity: 10,
      equipment: ["TV", "Phone"],
      isOccupied: true
    },
    {
      roomNumber: "103",
      type: "Meeting",
      capacity: 10,
      equipment: ["TV", "Phone"],
      isOccupied: false
    },
    {
      roomNumber: "104",
      type: "Meeting",
      capacity: 10,
      equipment: ["TV", "Phone"],
      isOccupied: true
    }

  ];
  rooms: any[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private hospital3dService: Hospital3dService) { }

  initialize(roomParameters: any = this.firstRooms) {
    // Dispose of any existing ThumbRaiser instance
    this.disposeThumbRaiser();

    // Initialize a new ThumbRaiser instance
    this.thumbRaiser = new ThumbRaiser(
      {}, // General Parameters
      { scale: new THREE.Vector3(1.0, 0.5, 1.0) }, // Maze parameters
      {}, // Player parameters
      {
        ambientLight: { intensity: 0.5 },
        pointLight1: { intensity: 50.0, distance: 20.0, position: new THREE.Vector3(-3.5, 10.0, 2.5) },
        pointLight2: { intensity: 50.0, distance: 20.0, position: new THREE.Vector3(3.5, 10.0, -2.5) },
        directionalLight: { intensity: 0.5, position: new THREE.Vector3(0.0, 10.0, 0.0) }
      }, // Lights parameters
      {}, // Fog parameters
      { view: "fixed", multipleViewsViewport: new THREE.Vector4(0.0, 1.0, 0.45, 0.5) },
      { view: "first-person", multipleViewsViewport: new THREE.Vector4(1.0, 1.0, 0.55, 0.5), initialOrientation: new Orientation(0.0, -10.0), initialDistance: 2.0, distanceMin: 1.0, distanceMax: 4.0 },
      { view: "third-person", multipleViewsViewport: new THREE.Vector4(0.0, 0.0, 0.55, 0.5), initialOrientation: new Orientation(0.0, -20.0), initialDistance: 2.0, distanceMin: 1.0, distanceMax: 4.0 },
      { view: "top", multipleViewsViewport: new THREE.Vector4(1.0, 0.0, 0.45, 0.5), initialOrientation: new Orientation(0.0, -90.0), initialDistance: 4.0, distanceMin: 1.0, distanceMax: 16.0 },
      { view: "mini-map", multipleViewsViewport: new THREE.Vector4(0.99, 0.02, 0.3, 0.3), initialOrientation: new Orientation(180.0, -90.0), initialZoom: 0.64 },
      {}, // Door parameters
      {}, // Table parameters
      {}, // Human parameters
      {}, //Exit door parameters
      { rooms: roomParameters }
    );

    if (!this.thumbRaiser.renderer || !this.thumbRaiser.update) {
      console.error('ThumbRaiser properties are not properly initialized');
    }

    // Append the renderer's DOM element to the scene container
    const container = document.getElementById('scene-container');
    if (container) {
      container.innerHTML = ''; // Clear any existing content
      container.appendChild(this.thumbRaiser.renderer.domElement);
    }
  }

  animate = () => {
    if (isPlatformBrowser(this.platformId)) {
      this.animationFrameId = requestAnimationFrame(this.animate);
      this.thumbRaiser.update();
    }
  };

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initialize();
      this.animate();
    }
  }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    this.disposeThumbRaiser();
  }

  disposeThumbRaiser(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.thumbRaiser) {
      this.thumbRaiser.dispose();
      this.thumbRaiser = null as any;
    }
  }

  checkOperations(): void {
    if (this.selectedDate) {
      this.loading = true;
      this.error = null;
      this.hospital3dService.getRoomsAvailabilityByDate(this.selectedDate).subscribe(
        (data: any[]) => {
          console.log('Rooms fetched:', data);
          this.rooms = data;
          const roomParameters = this.rooms;
          this.update3DVisualization(roomParameters);
          this.loading = false;
        },
        error => {
          console.error('Error fetching rooms', error);
          this.error = 'Error fetching rooms';
          this.loading = false;
        }
      );
    } else {
      this.error = 'No date selected';
    }
  }

  // Removed redundant logic here
  onDateChange(event: Event): void {
    // No need to manually assign the date, it's bound with ngModel
    console.log('Date changed:', this.selectedDate);
  }

  update3DVisualization(roomParameters: any): void {
    this.disposeThumbRaiser();
    this.initialize(roomParameters);
    this.animate();
  }
}
