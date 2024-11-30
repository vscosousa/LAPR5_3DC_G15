import * as THREE from "three";

/*
 * parameters = {
 *  ambientLight: { color: Integer, intensity: Float },
 *  pointLight1: { color: Integer, intensity: Float, distance: Float, position: Vector3 },
 *  pointLight2: { color: Integer, intensity: Float, distance: Float, position: Vector3 },
 *  spotLight: { color: Integer, intensity: Float, distance: Float, angle: Float, penumbra: Float, position: Vector3, direction: Float },
 *  directionalLight: { color: Integer, intensity: Float, position: Vector3, target: Vector3 }
 * }
 */

export default class Lights {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        // Create a group of objects
        this.object = new THREE.Group();

        // Create the ambient light
        this.object.ambientLight = new THREE.AmbientLight(this.ambientLight.color, this.ambientLight.intensity);
        this.object.add(this.object.ambientLight);

        // Create the first point light
        this.object.pointLight1 = new THREE.PointLight(this.pointLight1.color, this.pointLight1.intensity, this.pointLight1.distance);
        this.object.pointLight1.position.set(this.pointLight1.position.x, this.pointLight1.position.y, this.pointLight1.position.z);
        this.object.pointLight1.castShadow = true;
        this.object.pointLight1.shadow.mapSize.width = 512;
        this.object.pointLight1.shadow.mapSize.height = 512;
        this.object.pointLight1.shadow.camera.near = 5.0;
        this.object.pointLight1.shadow.camera.far = 15.0;
        this.object.pointLight1.visible = false;
        this.object.add(this.object.pointLight1);

        // Create the second point light
        this.object.pointLight2 = new THREE.PointLight(this.pointLight2.color, this.pointLight2.intensity, this.pointLight2.distance);
        this.object.pointLight2.position.set(this.pointLight2.position.x, this.pointLight2.position.y, this.pointLight2.position.z);
        this.object.pointLight2.castShadow = true;
        this.object.pointLight2.shadow.mapSize.width = 512;
        this.object.pointLight2.shadow.mapSize.height = 512;
        this.object.pointLight2.shadow.camera.near = 5.0;
        this.object.pointLight2.shadow.camera.far = 15.0;
        this.object.pointLight2.visible = false;
        this.object.add(this.object.pointLight2);

        // Create the directional light
        this.object.directionalLight = new THREE.DirectionalLight(this.directionalLight.color, this.directionalLight.intensity);
        this.object.directionalLight.castShadow = true;
        this.object.directionalLight.position.set(this.directionalLight.position.x, this.directionalLight.position.y, this.directionalLight.position.z);
        this.object.directionalLight.target.position.set(this.directionalLight.target.x, this.directionalLight.target.y, this.directionalLight.target.z);
        this.object.add(this.object.directionalLight);
        this.object.add(this.object.directionalLight.target);
    }
}
