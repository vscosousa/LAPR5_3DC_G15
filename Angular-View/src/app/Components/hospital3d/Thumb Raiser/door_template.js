import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/*
 * parameters = {
 *  modelUrl: String
 * }
 */

export default class Door {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        // Create a group of objects
        this.object = new THREE.Group();

        // Load the door model
        const loader = new GLTFLoader();
        loader.load(
            this.modelUrl,
            (gltf) => {
                const door = gltf.scene;
                door.castShadow = true;
                door.receiveShadow = true;
                this.object.add(door);
            },
            undefined,
            (error) => {
                console.error('Error loading door model:', error);
            }
        );
    }
}