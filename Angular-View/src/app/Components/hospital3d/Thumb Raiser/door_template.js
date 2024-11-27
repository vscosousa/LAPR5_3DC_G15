import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export const doorData = {
    url: "/models/gltf/RobotExpressive/hospital_door.glb",
    scale: new THREE.Vector3(1.0, 1.0, 2.0) // Adjust the z-axis scale to make the door thicker
};

export default class Door {
    constructor(parameters) {
        // Store the parameters
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        // Create a group for the door
        this.object = new THREE.Group();
        this.isLoaded = false; // Add a flag to track if the door model is loaded

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

                // Create a bounding box for the door
                this.boundingBox = new THREE.Box3().setFromObject(model);

                // Set the loaded flag to true
                this.isLoaded = true;
            },
            undefined, // Progress callback (optional)
            (error) => {
                console.error("Error loading the door model:", error);
            }
        );
    }

    open() {
        if (this.isLoaded) {
            this.object.rotation.y = Math.PI / 2;
            // Update the bounding box after rotation
            this.boundingBox.setFromObject(this.object);
        }
    }

    isTrespassing(object) {
        if (this.isLoaded) {
            // Only perform the collision check if the door is loaded
            const objectBoundingBox = new THREE.Box3().setFromObject(object);
            return this.boundingBox.intersectsBox(objectBoundingBox);
        }
        return false; // Return false if the door is not loaded
    }

    // Block movement if trespassing
    blockMovementIfTrespassing(object) {
        if (this.isTrespassing(object)) {
            console.log("Movement blocked: Door is in the way!");
            // Implement logic to prevent movement. This could involve stopping the player's movement or adjusting their position.
            // Example: If the object is the player, stop their movement or adjust position
            object.position.copy(object.previousPosition); // Prevent movement by reverting to the previous position
        }
    }
}
