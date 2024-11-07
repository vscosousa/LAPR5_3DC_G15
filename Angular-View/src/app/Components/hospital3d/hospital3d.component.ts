import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';



@Component({
    selector: 'app-hospital3d',
    templateUrl: './hospital3d.component.html',
    styleUrls: ['./hospital3d.component.scss']
})

export class Hospital3dComponent implements OnInit, AfterViewInit, OnDestroy {
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
    /*private thumbRaiser!: ThumbRaiser;
    floorPlan: string = "./hospital3dFiles\mazes\Loquitas.json";
    params: any = {
        floorPlan: this.floorPlan,
        helpersColor: new THREE.Color(0xff0077)};
    };

    constructor() { }

    initialize(){
      this.thumbRaiser = new ThumbRaiser({}, //general parameters
        {url: this.params.floorPlan},//maze parameters
        { helpersColor: new THREE.Color(0x0055ff) },//player parameters
        {  intensity: 0.1 },//light parameters
        {
          intensity: 0.5,
          distance: 20.0,
          orientation: new Orientation(-38.7, 53.1),
          castShadow: true,
          shadow: {
              mapSize: new THREE.Vector2(2048, 2048),
              camera: {
                  left: -20.0,
                  right: 20.0,
                  top: 20.0,
                  bottom: -20.0,
                  near: 0.0,
                  far: 40.0
              }
          }
      }, // Directional light parameters
      {
          visible: false,
          intensity: 90.0,
          distance: 40.0,
          angle: 4.0,
          position: new THREE.Vector3(0.0, 10.0, 0.0),
          castShadow: true,
          shadow: {
              camera: {
                  near: 5.0,
                  far: 30.0
              }
          }
      }, // Spotlight parameters
      {
          color: new THREE.Color(0xffffa0),
          visible: false,
          intensity: 2.0,
          distance: 5.0,
          angle: 20.0,
          orientation: new Orientation(0.0, -20.0),
          castShadow: true,
          shadow: {
              camera: {
                  near: 0.01,
                  far: 10.0
              }
          }
      }, // Flashlight parameters
      { type: THREE.PCFSoftShadowMap }, // Shadows parameters
      {}, // Fog parameters
      {}, // Collision detection parameters
      { view: "fixed", initialViewport: new THREE.Vector4(0.0, 1.0, 0.45, 0.5), initialDistance: 16.0, distanceMin: 8.0, distanceMax: 32.0, initialFogDensity: 0.05 }, // Fixed view camera parameters
      { view: "first-person", initialViewport: new THREE.Vector4(1.0, 1.0, 0.55, 0.5), initialOrientation: new Orientation(0.0, -10.0), orientationMax: new Orientation(180.0, 90.0), initialFogDensity: 0.7 }, // First-person view camera parameters
      { view: "third-person", initialViewport: new THREE.Vector4(0.0, 0.0, 0.55, 0.5), initialOrientation: new Orientation(0.0, -20.0), initialDistance: 2.0, distanceMin: 1.0, distanceMax: 4.0, initialFogDensity: 0.3 }, // Third-person view camera parameters
      { view: "top", initialViewport: new THREE.Vector4(1.0, 0.0, 0.45, 0.5), initialOrientation: new Orientation(0.0, -90.0), initialDistance: 4.0, distanceMin: 1.0, distanceMax: 16.0, initialFogDensity: 0.2 }, // Top view camera parameters
      { view: "mini-map", initialViewport: new THREE.Vector4(1, 0, 0.4, 0.4), initialOrientation: new Orientation(180.0, -90.0), initialZoom: 0.32, zoomMin: 0.32, zoomMax: 2.56 }, // Mini-map view camera parameters
      { },
  );




    }

    ngAfterViewInit(): void {
        this.animate();
    }

    ngOnDestroy(): void {
        // Clean up resources
        if (this.thumbRaiser) {
            // Perform any necessary cleanup here
        }
    }

    private animate(): void {
        requestAnimationFrame(() => this.animate());
        if (this.thumbRaiser) {
            this.thumbRaiser.update();
        }
    }
}
*/
