import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class Table {
    constructor(parameters) {
        // Store parameters
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        // Create a group for the table
        this.object = new THREE.Group();

        // Initialize tables array
        this.tables = [];

        // Load the table model using GLTFLoader
        const loader = new GLTFLoader();
        loader.load(
            this.url, // URL of the table model
            (gltf) => {
                const model = gltf.scene;

                // Enable shadows for the model
                model.traverse((node) => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                        // Add a unique name or property to identify the table
                        node.name = this.name || "Table";
                        node.isTable = true; // Add a custom property to identify table objects
                    }
                });

                // Scale the model
                model.scale.copy(this.scale);

                // Add the model to the table group
                this.object.add(model);

                // Add the table group to the tables array
                this.tables.push(this.object);
            },
            undefined,
            (error) => {
                console.error("Error loading the table model:", error);
            }
        );
    }

    addToScene(scene) {
        this.tables.forEach(table => scene.add(table));
    }

    handleRaycast(raycaster, callback) {
        const intersects = raycaster.intersectObjects(this.tables, true);
        const intersectedTable = intersects.find(intersect => intersect.object.isTable);
        if (intersectedTable && callback) {
            callback(intersectedTable.object);
        }
    }
}