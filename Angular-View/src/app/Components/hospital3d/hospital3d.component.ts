import { AfterViewInit, Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import * as THREE from "three";
import Orientation from "./Thumb Raiser/orientation";
import ThumbRaiser from "./Thumb Raiser/thumb_raiser_template";

@Component({
  selector: 'app-hospital3d',
  standalone: true,
  templateUrl: './hospital3d.component.html',
  styleUrls: ['./hospital3d.component.scss']
})
export class Hospital3dComponent implements OnInit, AfterViewInit {

  thumbRaiser!: ThumbRaiser;
  private animationFrameId: number | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  initialize() {
    // Create the game
    this.thumbRaiser = new ThumbRaiser(
      {}, // General Parameters
      { scale: new THREE.Vector3(1.0, 0.5, 1.0) }, // Maze parameters
      {}, // Player parameters
      { 
        ambientLight: { intensity: 0.1 }, 
        pointLight1: { intensity: 50.0, distance: 20.0, position: new THREE.Vector3(-3.5, 10.0, 2.5) },
        pointLight2: { intensity: 50.0, distance: 20.0, position: new THREE.Vector3(3.5, 10.0, -2.5) }
      }, // Lights parameters
      {}, // Fog parameters
      { view: "fixed", multipleViewsViewport: new THREE.Vector4(0.0, 1.0, 0.45, 0.5) }, // Fixed view camera parameters
      { view: "first-person", multipleViewsViewport: new THREE.Vector4(1.0, 1.0, 0.55, 0.5), initialOrientation: new Orientation(0.0, -10.0), initialDistance: 2.0, distanceMin: 1.0, distanceMax: 4.0 }, // First-person view camera parameters
      { view: "third-person", multipleViewsViewport: new THREE.Vector4(0.0, 0.0, 0.55, 0.5), initialOrientation: new Orientation(0.0, -20.0), initialDistance: 2.0, distanceMin: 1.0, distanceMax: 4.0 }, // Third-person view camera parameters
      { view: "top", multipleViewsViewport: new THREE.Vector4(1.0, 0.0, 0.45, 0.5), initialOrientation: new Orientation(0.0, -90.0), initialDistance: 4.0, distanceMin: 1.0, distanceMax: 16.0 }, // Top view camera parameters
      { view: "mini-map", multipleViewsViewport: new THREE.Vector4(0.99, 0.02, 0.3, 0.3), initialOrientation: new Orientation(180.0, -90.0), initialZoom: 0.64 } // Mini-map view camera parameters
    );

    if (!this.thumbRaiser.renderer || !this.thumbRaiser.update) {
      console.error('ThumbRaiser properties are not properly initialized');
    }
  }

  animate = () => {
    if (isPlatformBrowser(this.platformId)) {
      this.animationFrameId = requestAnimationFrame(this.animate);
      this.thumbRaiser.update();
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initialize();
      this.animate();
    }
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
