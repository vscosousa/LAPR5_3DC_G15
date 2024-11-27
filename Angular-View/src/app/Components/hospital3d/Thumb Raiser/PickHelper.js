import * as THREE from "three";

class PickHelper {
    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

    // Method to raycast for table objects
    pickTable(event, scene, camera, callback) {
        // Update the mouse coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Set the raycaster from the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, camera);

        // Get the list of objects the ray intersects
        const intersects = this.raycaster.intersectObjects(scene.children, true);

        // Find the first intersected object that is a table
        const intersectedTable = intersects.find(intersect => intersect.object.isTable);

        // If a table is intersected, call the callback with the intersected object
        if (intersectedTable && callback) {
            callback(intersectedTable.object);
        }
    }
}

export default PickHelper;