import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export const humanData = {
    url: "/models/gltf/RobotExpressive/human.glb",
    scale: new THREE.Vector3(1.0, 1.0, 1.0)
};

export default class Human {
    constructor(parameters) {
        // Store the parameters
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        // Create a group for the door
        this.object = new THREE.Group();

        // Load the door model using GLTFLoader
        const loader = new GLTFLoader();
        loader.load(
            this.url, // URL of the door model
            (gltf) => {
                const model = gltf.scene;

                // Enable shadows for the model
                model.traverse((node) => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });

                // Scale the model
                model.scale.copy(this.scale);

                // Add the model to the door group
                this.object.add(model);
            },
            undefined, // Progress callback (optional)
            (error) => {
                console.error("Error loading the door model:", error);
            }
        );
    }
}