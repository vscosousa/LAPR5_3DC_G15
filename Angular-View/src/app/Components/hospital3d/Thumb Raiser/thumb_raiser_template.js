// Thumb Raiser - JPP 2021, 2022, 2023
// 3D modeling
// 3D models importing
// Perspective and orthographic projections
// Viewing
// Linear and affine transformations
// Lighting and materials
// Shadow projection
// Fog
// Texture mapping
// User interaction

import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import Orientation from "./orientation.js";
import { generalData, mazeData, playerData, lightsData, fogData, cameraData, doorData, tableData, humanData, exitDoorData, hearthMonitorData, hearthTableData, surgicalEquipmentData, surgeonData } from "./default_data.js";
import { merge } from "./merge.js";
import Maze from "./maze_template.js";
import Player from "./player_template.js";
import Lights from "./lights_template.js";
import Fog from "./fog_template.js";
import Camera from "./camera_template.js";
import Animations from "./animations_template.js";
import Door from "./door_template.js";
import UserInterface from "./user_interface_template.js";
import Table from "./table.js";
import RoomInfoHandler from "./RoomInfoHandler.js";


export default class ThumbRaiser {

    constructor(generalParameters, mazeParameters, playerParameters, lightsParameters, fogParameters, fixedViewCameraParameters, firstPersonViewCameraParameters, thirdPersonViewCameraParameters, topViewCameraParameters, miniMapCameraParameters, doorParameters, tableParameters, humanParameters, exitDoorParameters, hearthMonitorParameters, hearthTableParameters, surgicalEquipmentParameters, surgeonParameters, roomParameters) {
        this.generalParameters = merge({}, generalData, generalParameters);
        this.mazeParameters = merge({}, mazeData, mazeParameters);
        this.playerParameters = merge({}, playerData, playerParameters);
        this.lightsParameters = merge({}, lightsData, lightsParameters);
        this.fogParameters = merge({}, fogData, fogParameters);
        this.fixedViewCameraParameters = merge({}, cameraData, fixedViewCameraParameters);
        this.firstPersonViewCameraParameters = merge({}, cameraData, firstPersonViewCameraParameters);
        this.thirdPersonViewCameraParameters = merge({}, cameraData, thirdPersonViewCameraParameters);
        this.topViewCameraParameters = merge({}, cameraData, topViewCameraParameters);
        this.miniMapCameraParameters = merge({}, cameraData, miniMapCameraParameters);
        this.doorParameters = merge({}, doorData, doorParameters);
        this.tableParameters = merge({}, tableData, tableParameters);
        this.humanParameters = merge({}, humanData, humanParameters);
        this.exitDoorParameters = merge({}, exitDoorData, exitDoorParameters);
        this.hearthMonitorParameters = merge({}, hearthMonitorData, hearthMonitorParameters);
        this.hearthTableParameters = merge({}, hearthTableData, hearthTableParameters);
        this.surgicalEquipmentParameters = merge({}, surgicalEquipmentData, surgicalEquipmentParameters);
        this.surgeonParameters = merge({}, surgeonData, surgeonParameters);
        this.roomParameters = roomParameters && roomParameters.rooms ? roomParameters.rooms : [];

        // Create a 2D scene (the viewports frames)
        this.scene2D = new THREE.Scene();


        // Create a square
        let points = [new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(1.0, 0.0, 0.0), new THREE.Vector3(1.0, 1.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0)];
        let geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0xffffff });
        this.square = new THREE.LineLoop(geometry, material);
        this.scene2D.add(this.square);

        // Create the camera corresponding to the 2D scene
        this.camera2D = new THREE.OrthographicCamera(0.0, 1.0, 1.0, 0.0, 0.0, 1.0);

        // Create a 3D scene (the game itself)
        this.scene3D = new THREE.Scene();

        // Create the maze
        this.maze = new Maze(this.mazeParameters, this.doorParameters, this.tableParameters, this.humanParameters, this.exitDoorParameters, this.hearthMonitorParameters, this.hearthTableParameters, this.surgicalEquipmentParameters, this.surgeonParameters, this.roomParameters);

        // Create the player
        this.player = new Player(this.playerParameters);

        // Create the lights
        this.lights = new Lights(this.lightsParameters);

        // Create the fog
        this.fog = new Fog(this.fogParameters);

        this.door = new Door(this.doorParameters);

        this.table = new Table(this.tableParameters);

        // Create the cameras corresponding to the four different views: fixed view, first-person view, third-person view and top view
        this.fixedViewCamera = new Camera(this.fixedViewCameraParameters, window.innerWidth, window.innerHeight);
        this.firstPersonViewCamera = new Camera(this.firstPersonViewCameraParameters, window.innerWidth, window.innerHeight);
        this.thirdPersonViewCamera = new Camera(this.thirdPersonViewCameraParameters, window.innerWidth, window.innerHeight);
        this.topViewCamera = new Camera(this.topViewCameraParameters, window.innerWidth, window.innerHeight);

        // Create the mini-map camera
        this.miniMapCamera = new Camera(this.miniMapCameraParameters, window.innerWidth, window.innerHeight);

        // Create the statistics and make its node invisible
        this.statistics = new Stats();
        this.statistics.dom.style.visibility = "hidden";
        document.body.appendChild(this.statistics.dom);

        // Create a renderer and turn on shadows in the renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        if (this.generalParameters.setDevicePixelRatio) {
            this.renderer.setPixelRatio(window.devicePixelRatio);
        }
        this.renderer.autoClear = false;
        /* To-do #30 - Turn on shadows in the renderer and filter shadow maps using the Percentage-Closer Filtering (PCF) algorithm*/
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Set the mouse move action (none)
        this.dragMiniMap = false;
        this.changeCameraDistance = false;
        this.changeCameraOrientation = false;

        // Set the game state
        this.gameRunning = false;

        // Get and configure the panel's <div> elements
        this.viewsPanel = document.getElementById("views-panel");
        this.view = document.getElementById("view");
        this.projection = document.getElementById("projection");
        this.horizontal = document.getElementById("horizontal");
        this.horizontal.step = 1;
        this.vertical = document.getElementById("vertical");
        this.vertical.step = 1;
        this.distance = document.getElementById("distance");
        this.distance.step = 0.1;
        this.zoom = document.getElementById("zoom");
        this.zoom.step = 0.1;
        this.reset = document.getElementById("reset");
        this.resetAll = document.getElementById("reset-all");
        this.helpPanel = document.getElementById("help-panel");
        this.helpPanel.style.visibility = "hidden";
        this.subwindowsPanel = document.getElementById("subwindows-panel");
        this.multipleViewsCheckBox = document.getElementById("multiple-views");
        this.multipleViewsCheckBox.checked = false;
        this.userInterfaceCheckBox = document.getElementById("user-interface");
        this.userInterfaceCheckBox.checked = true;
        this.miniMapCheckBox = document.getElementById("mini-map");
        this.miniMapCheckBox.checked = true;
        this.helpCheckBox = document.getElementById("help");
        this.helpCheckBox.checked = false;
        this.statisticsCheckBox = document.getElementById("statistics");
        this.statisticsCheckBox.checked = false;
        this.sceneContainer = document.getElementById("scene-container");
        this.renderer.domElement.id = "scene-container";


        this.exitMenu = document.getElementById("exit-menu");
        this.exitYesButton = document.getElementById("exit-yes");
        this.exitNoButton = document.getElementById("exit-no");

        // Add event listeners for the exit menu buttons
        if (this.exitYesButton && this.exitNoButton) {
            this.exitYesButton.addEventListener("click", () => this.exitGame());
            this.exitNoButton.addEventListener("click", () => this.continueGame());
        }


        // Build the help panel
        this.buildHelpPanel();

        // Set the active view camera (fixed view)
        this.setActiveViewCamera(this.fixedViewCamera);

        // Arrange viewports by view mode
        this.arrangeViewports(this.multipleViewsCheckBox.checked);

        // Register the event handler to be called on window resize
        window.addEventListener("resize", event => this.windowResize(event));

        // Register the event handler to be called on key down
        document.addEventListener("keydown", event => this.keyChange(event, true));

        // Register the event handler to be called on key release
        document.addEventListener("keyup", event => this.keyChange(event, false));

        // Register the event handler to be called on mouse down
        this.renderer.domElement.addEventListener("mousedown", event => this.mouseDown(event));

        // Register the event handler to be called on mouse move
        this.renderer.domElement.addEventListener("mousemove", event => this.mouseMove(event));

        // Register the event handler to be called on mouse up
        this.renderer.domElement.addEventListener("mouseup", event => this.mouseUp(event));

        // Register the event handler to be called on mouse wheel
        this.renderer.domElement.addEventListener("wheel", event => this.mouseWheel(event));

        // Register the event handler to be called on context menu
        this.renderer.domElement.addEventListener("contextmenu", event => this.contextMenu(event));

        // Register the event handler to be called on mouse click
        this.renderer.domElement.addEventListener("click", event => this.mouseClick(event));


        // Register the event handler to be called on select, input number, or input checkbox change
        this.view.addEventListener("change", event => this.elementChange(event));
        this.projection.addEventListener("change", event => this.elementChange(event));
        this.horizontal.addEventListener("change", event => this.elementChange(event));
        this.vertical.addEventListener("change", event => this.elementChange(event));
        this.distance.addEventListener("change", event => this.elementChange(event));
        this.zoom.addEventListener("change", event => this.elementChange(event));
        this.multipleViewsCheckBox.addEventListener("change", event => this.elementChange(event));
        this.userInterfaceCheckBox.addEventListener("change", event => this.elementChange(event));
        this.helpCheckBox.addEventListener("change", event => this.elementChange(event));
        this.statisticsCheckBox.addEventListener("change", event => this.elementChange(event));


        // Register the event handler to be called on input button click
        this.reset.addEventListener("click", event => this.buttonClick(event));
        this.resetAll.addEventListener("click", event => this.buttonClick(event));

        this.activeElement = document.activeElement;
        // Usage


        this.roomInfoHandler = new RoomInfoHandler(this.roomParameters);


        //Sound effects


        //add sound effect to player movement
        this.player.moveSound = new Audio("/audios/walking.mp3");
        console.log(this.player.moveSound);
        this.player.moveSound.loop = true;
        this.player.moveSound.volume = 0.3;

        this.activeKeys = new Set(); // Track currently pressed keys


        this.player.hitWallSound = new Audio("/audios/hurt.mp3");
        this.player.hitWallSound.loop = false;
        this.player.hitWallSound.volume = 0.3;


        this.door.hearthSound = new Audio("/audios/heartbit.mp3");
        this.door.hearthSound.loop = true;











    }


    mouseClick(event) {
        if (event.button !== 0) {
            // Ignore non-left-clicks
            return;
        }

        if (event.target.id === "scene-container") {
            event.preventDefault();

            // Initialize raycaster and mouse position
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2(
                (event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1
            );

            // Cast a ray from the camera
            raycaster.setFromCamera(mouse, this.activeViewCamera.object);

            // Perform raycast to get intersected objects
            const intersects = raycaster.intersectObjects(this.scene3D.children, true);

            if (intersects.length > 0) {
                // Find the first intersected object that is a table
                const intersectedTable = intersects.find(intersect => intersect.object.isTable);

                if (intersectedTable) {
                    const table = intersectedTable.object;
                    console.log("Picked table:", table.name);

                    // Handle room selection and camera movement only for tables
                    this.roomInfoHandler.selectRoomFromTable(table);
                    this.moveCameraToTable(table);
                }
            }
        }
    }



    moveCameraToTable(table) {
        // Avoid redundant animations
        if (this.isCameraAnimating) {
            console.log("Camera is already animating");
            return;
        }

        // Mark camera as animating
        this.isCameraAnimating = true;

        // Calculate target position and orientation
        const box = new THREE.Box3().setFromObject(table);
        console.log("Bounding Box:", box);
        const targetPosition = box.getCenter(new THREE.Vector3());
        console.log("Target Position:", targetPosition);

        const camera = this.activeViewCamera.object;
        const offset = new THREE.Vector3(0, 6, 0);
        // Final position should always be the same independent of the initial camera position
        const finalPosition = targetPosition.clone().add(offset);
        console.log("Final Position:", finalPosition);

        // Camera start and target state
        const startPosition = camera.position.clone();
        const startQuaternion = camera.quaternion.clone();

        // Ensure the camera always looks straight at the target without inclination
        const upVector = new THREE.Vector3(0, 1, 0); // Ensure the "up" direction is consistent
        const targetQuaternion = new THREE.Quaternion().setFromRotationMatrix(
            new THREE.Matrix4().lookAt(finalPosition, targetPosition, upVector)
        );

        const startZoom = camera.zoom;
        const targetZoom = 1; // Adjust this value as needed

        const duration = 1500; // Animation duration in ms
        const startTime = Date.now();

        const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

        const animateCamera = () => {
            const elapsedTime = Date.now() - startTime;
            const t = Math.min(elapsedTime / duration, 1);
            const easedT = easeInOutQuad(t);

            // Interpolate camera position, orientation, and zoom
            camera.position.lerpVectors(startPosition, finalPosition, easedT);
            camera.quaternion.slerpQuaternions(startQuaternion, targetQuaternion, easedT);
            camera.zoom = THREE.MathUtils.lerp(startZoom, targetZoom, easedT);
            camera.updateProjectionMatrix();

            // Update spotlight position if it exists
            if (this.spotlight) {
                const spotlightOffset = new THREE.Vector3(0, 10, 0);
                const spotlightFinalPosition = finalPosition.clone().add(spotlightOffset);
                this.spotlight.position.lerpVectors(
                    startPosition.clone().add(spotlightOffset),
                    spotlightFinalPosition,
                    easedT
                );
                this.spotlight.target.position.copy(targetPosition);
                this.spotlight.target.updateMatrixWorld();
            }

            if (t < 1) {
                requestAnimationFrame(animateCamera);
            } else {
                // Animation finished
                this.isCameraAnimating = false;
            }
        };

        animateCamera();
    }





    buildHelpPanel() {
        const table = document.getElementById("help-table");
        let i = 0;
        for (const key in this.player.keyCodes) {
            while (table.rows[i].cells.length < 2) {
                i++;
            };
            table.rows[i++].cells[0].innerHTML = this.player.keyCodes[key];
        }
        table.rows[i].cells[0].innerHTML = this.maze.credits + "<br>" + this.player.credits;
    }

    displayPanel() {
        this.view.options.selectedIndex = ["fixed", "first-person", "third-person", "top"].indexOf(this.activeViewCamera.view);
        this.projection.options.selectedIndex = ["perspective", "orthographic"].indexOf(this.activeViewCamera.projection);
        this.horizontal.value = this.activeViewCamera.orientation.h.toFixed(0);
        this.vertical.value = this.activeViewCamera.orientation.v.toFixed(0);
        this.distance.value = this.activeViewCamera.distance.toFixed(1);
        this.zoom.value = this.activeViewCamera.zoom.toFixed(1);
    }

    // Set active view camera
    setActiveViewCamera(camera) {
        this.activeViewCamera = camera;
        this.horizontal.min = this.activeViewCamera.orientationMin.h.toFixed(0);
        this.horizontal.max = this.activeViewCamera.orientationMax.h.toFixed(0);
        this.vertical.min = this.activeViewCamera.orientationMin.v.toFixed(0);
        this.vertical.max = this.activeViewCamera.orientationMax.v.toFixed(0);
        this.distance.min = this.activeViewCamera.distanceMin.toFixed(1);
        this.distance.max = this.activeViewCamera.distanceMax.toFixed(1);
        this.zoom.min = this.activeViewCamera.zoomMin.toFixed(1);
        this.zoom.max = this.activeViewCamera.zoomMax.toFixed(1);
        this.displayPanel();
    }

    arrangeViewports(multipleViews) {
        this.fixedViewCamera.setViewport(multipleViews);
        this.firstPersonViewCamera.setViewport(multipleViews);
        this.thirdPersonViewCamera.setViewport(multipleViews);
        this.topViewCamera.setViewport(multipleViews);
    }

    pointerIsOverViewport(pointer, viewport) {
        return (
            pointer.x >= viewport.x &&
            pointer.x < viewport.x + viewport.width &&
            pointer.y >= viewport.y &&
            pointer.y < viewport.y + viewport.height);
    }

    getPointedViewport(pointer) {
        let viewport;
        // Check if the pointer is over the mini-map camera viewport
        if (this.miniMapCheckBox.checked) {
            viewport = this.miniMapCamera.getViewport();
            if (this.pointerIsOverViewport(pointer, viewport)) {
                return this.miniMapCamera.view;
            }
        }
        // Check if the pointer is over the remaining camera viewports
        let cameras;
        if (this.multipleViewsCheckBox.checked) {
            cameras = [this.fixedViewCamera, this.firstPersonViewCamera, this.thirdPersonViewCamera, this.topViewCamera];
        }
        else {
            cameras = [this.activeViewCamera];
        }
        for (const camera of cameras) {
            viewport = camera.getViewport();
            if (this.pointerIsOverViewport(pointer, viewport)) {
                return camera.view;
            }
        }
        // No camera viewport is being pointed
        return "none";
    }

    setViewMode(multipleViews) { // Single-view mode: false; multiple-views mode: true
        this.multipleViewsCheckBox.checked = multipleViews;
        this.arrangeViewports(this.multipleViewsCheckBox.checked);
    }

    setUserInterfaceVisibility(visible) {
        this.userInterfaceCheckBox.checked = visible;
        this.viewsPanel.style.visibility = visible ? "visible" : "hidden";
        this.subwindowsPanel.style.visibility = visible ? "visible" : "hidden";
        this.userInterface.setVisibility(visible);
    }

    setMiniMapVisibility(visible) { // Hidden: false; visible: true
        this.miniMapCheckBox.checked = visible;
    }

    setHelpVisibility(visible) { // Hidden: false; visible: true
        this.helpCheckBox.checked = visible;
        this.helpPanel.style.visibility = visible ? "visible" : "hidden";
    }

    setStatisticsVisibility(visible) { // Hidden: false; visible: true
        this.statisticsCheckBox.checked = visible;
        this.statistics.dom.style.visibility = visible ? "visible" : "hidden";
    }

    windowResize() {
        this.fixedViewCamera.updateWindowSize(window.innerWidth, window.innerHeight);
        this.firstPersonViewCamera.updateWindowSize(window.innerWidth, window.innerHeight);
        this.thirdPersonViewCamera.updateWindowSize(window.innerWidth, window.innerHeight);
        this.topViewCamera.updateWindowSize(window.innerWidth, window.innerHeight);
        this.miniMapCamera.updateWindowSize(window.innerWidth, window.innerHeight);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    keyChange(event, state) {
        // Allow digit and arrow keys to be used when entering numbers
        if (["horizontal", "vertical", "distance", "zoom"].indexOf(event.target.id) < 0) {
            event.target.blur();
        }
        if (["Space", "ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"].includes(event.code)) {
            event.preventDefault();

            if (state) {
                // Add the key to the active keys set and play the sound if not already playing
                if (!this.activeKeys.has(event.code)) {
                    this.activeKeys.add(event.code);
                    if (event.code === "ArrowUp" || event.code === "ArrowDown") {
                        this.player.moveSound.play();
                    }
                }
            } else {
                // Remove the key from the active keys set
                this.activeKeys.delete(event.code);

                // Pause the sound only if no movement keys are being pressed
                if (this.activeKeys.size === 0 || (event.code === "ArrowUp" || event.code === "ArrowDown")) {
                    this.player.moveSound.pause();
                    this.player.moveSound.currentTime = 0; // Reset sound
                }
            }

            if (event.code == this.player.keyCodes.fixedView && state) { // Select fixed view
                this.setActiveViewCamera(this.fixedViewCamera);
            }
            else if (event.code == this.player.keyCodes.firstPersonView && state) { // Select first-person view
                this.setActiveViewCamera(this.firstPersonViewCamera);
            }
            else if (event.code == this.player.keyCodes.thirdPersonView && state) { // Select third-person view
                this.setActiveViewCamera(this.thirdPersonViewCamera);
            }
            else if (event.code == this.player.keyCodes.topView && state) { // Select top view
                this.setActiveViewCamera(this.topViewCamera);
            }
            if (event.code == this.player.keyCodes.viewMode && state) { // Single-view mode / multiple-views mode
                this.setViewMode(!this.multipleViewsCheckBox.checked);
            }
            /* To-do #41 - Toggle the user interface visibility
                - event code: this.player.keyCodes.userInterface
                - state: true
            if (... && ...) { // Display / hide user interface
                this.setUserInterfaceVisibility(!this.userInterfaceCheckBox.checked);
            } */
            if (event.code == this.player.keyCodes.miniMap && state) { // Display / hide mini-map
                this.setMiniMapVisibility(!this.miniMapCheckBox.checked);
            }
            if (event.code == this.player.keyCodes.help && state) { // Display / hide help
                this.setHelpVisibility(!this.helpCheckBox.checked);
            }
            if (event.code == this.player.keyCodes.statistics && state) { // Display / hide statistics
                this.setStatisticsVisibility(!this.statisticsCheckBox.checked);
            }
            if (event.code == this.player.keyCodes.run) {
                this.player.keyStates.run = state;
            }
            if (event.code == this.player.keyCodes.left) {
                this.player.keyStates.left = state;
            }
            else if (event.code == this.player.keyCodes.right) {
                this.player.keyStates.right = state;
            }
            if (event.code == this.player.keyCodes.backward) {
                this.player.keyStates.backward = state;
            }
            else if (event.code == this.player.keyCodes.forward) {
                this.player.keyStates.forward = state;
            }
            if (event.code == this.player.keyCodes.jump) {
                this.player.keyStates.jump = state;
            }
            else if (event.code == this.player.keyCodes.yes) {
                this.player.keyStates.yes = state;
            }
            else if (event.code == this.player.keyCodes.no) {
                this.player.keyStates.no = state;
            }
            else if (event.code == this.player.keyCodes.wave) {
                this.player.keyStates.wave = state;
            }
            else if (event.code == this.player.keyCodes.punch) {
                this.player.keyStates.punch = state;
            }
            else if (event.code == this.player.keyCodes.thumbsUp) {
                this.player.keyStates.thumbsUp = state;
            }

        }
    }

    mouseDown(event) {
        if (event.buttons == 2) { // Primary or secondary button down
            this.isRotating = true; // Set rotating flag to true


            // Store current mouse position in window coordinates (mouse coordinate system: origin in the top-left corner; window coordinate system: origin in the bottom-left corner)
            this.mousePosition = new THREE.Vector2(event.clientX, window.innerHeight - event.clientY - 1);
            // Select the camera whose view is being pointed
            const cameraView = this.getPointedViewport(this.mousePosition);
            if (cameraView != "none") {
                if (cameraView == "mini-map") { // Mini-map camera selected
                    if (event.buttons == 1) { // Primary button down
                        this.dragMiniMap = true;
                    }
                } else { // One of the remaining cameras selected
                    const cameraIndex = ["fixed", "first-person", "third-person", "top"].indexOf(cameraView);
                    this.view.options.selectedIndex = cameraIndex;
                    this.setActiveViewCamera([this.fixedViewCamera, this.firstPersonViewCamera, this.thirdPersonViewCamera, this.topViewCamera][cameraIndex]);
                    if (event.buttons == 1) { // Primary button down
                        this.changeCameraDistance = true;
                    } else { // Secondary button down
                        this.changeCameraOrientation = true;
                    }
                }
            }
            if (this.isRotating == true) {
                this.roomInfoHandler.deselectRoom();
            }
        }
    }

    mouseMove(event) {
        if (event.buttons == 1 || event.buttons == 2) { // Primary or secondary button down
            if (this.changeCameraDistance || this.changeCameraOrientation || this.dragMiniMap) { // Mouse action in progress
                // Compute mouse movement and update mouse position
                const newMousePosition = new THREE.Vector2(event.clientX, window.innerHeight - event.clientY - 1);
                const mouseIncrement = newMousePosition.clone().sub(this.mousePosition);
                this.mousePosition = newMousePosition;
                if (event.buttons == 1) { // Primary button down
                    if (this.changeCameraDistance) {
                        this.activeViewCamera.updateDistance(-0.05 * (mouseIncrement.x + mouseIncrement.y));
                        this.displayPanel();
                    }
                    else if (this.dragMiniMap) {
                        const windowMinSize = Math.min(window.innerWidth, window.innerHeight);
                        const width = this.miniMapCamera.viewport.width * windowMinSize;
                        const height = this.miniMapCamera.viewport.height * windowMinSize;
                        this.miniMapCamera.viewport.x += mouseIncrement.x / (window.innerWidth - width);
                        this.miniMapCamera.viewport.y += mouseIncrement.y / (window.innerHeight - height);
                    }
                }
                else { // Secondary button down
                    if (this.changeCameraOrientation) {
                        this.activeViewCamera.updateOrientation(mouseIncrement.multiply(new THREE.Vector2(-0.5, 0.5)));
                        this.displayPanel();
                    }
                }
            }
        }
    }

    mouseUp(event) {
        // Reset mouse move action
        this.dragMiniMap = false;
        this.changeCameraDistance = false;
        this.changeCameraOrientation = false;
    }

    mouseWheel(event) {
        // Prevent the mouse wheel from scrolling the document's content
        event.preventDefault();
        // Store current mouse position in window coordinates (mouse coordinate system: origin in the top-left corner; window coordinate system: origin in the bottom-left corner)
        this.mousePosition = new THREE.Vector2(event.clientX, window.innerHeight - event.clientY - 1);
        // Select the camera whose view is being pointed
        const cameraView = this.getPointedViewport(this.mousePosition);
        if (cameraView != "none" && cameraView != "mini-map") { // One of the remaining cameras selected
            const cameraIndex = ["fixed", "first-person", "third-person", "top"].indexOf(cameraView);
            this.view.options.selectedIndex = cameraIndex;
            const activeViewCamera = [this.fixedViewCamera, this.firstPersonViewCamera, this.thirdPersonViewCamera, this.topViewCamera][cameraIndex];
            activeViewCamera.updateZoom(-0.001 * event.deltaY);
            this.setActiveViewCamera(activeViewCamera);
        }
    }



    contextMenu(event) {
        // Prevent the context menu from appearing when the secondary mouse button is clicked
        event.preventDefault();
    }

    elementChange(event) {
        switch (event.target.id) {
            case "view":
                this.setActiveViewCamera([this.fixedViewCamera, this.firstPersonViewCamera, this.thirdPersonViewCamera, this.topViewCamera][this.view.options.selectedIndex]);
                break;
            case "projection":
                this.activeViewCamera.setActiveProjection(["perspective", "orthographic"][this.projection.options.selectedIndex]);
                this.displayPanel();
                break;
            case "horizontal":
            case "vertical":
            case "distance":
            case "zoom":
                if (event.target.checkValidity()) {
                    switch (event.target.id) {
                        case "horizontal":
                        case "vertical":
                            this.activeViewCamera.setOrientation(new Orientation(this.horizontal.value, this.vertical.value));
                            break;
                        case "distance":
                            this.activeViewCamera.setDistance(this.distance.value);
                            break;
                        case "zoom":
                            this.activeViewCamera.setZoom(this.zoom.value);
                            break;
                    }
                }
                break;
            case "multiple-views":
                this.setViewMode(event.target.checked);
                break;
            case "user-interface":
                this.setUserInterfaceVisibility(event.target.checked);
                break;
            case "help":
                this.setHelpVisibility(event.target.checked);
                break;
            case "statistics":
                this.setStatisticsVisibility(event.target.checked);
                break;
        }
    }

    buttonClick(event) {
        switch (event.target.id) {
            case "reset":
                this.activeViewCamera.initialize();
                break;
            case "reset-all":
                this.fixedViewCamera.initialize();
                this.firstPersonViewCamera.initialize();
                this.thirdPersonViewCamera.initialize();
                this.topViewCamera.initialize();
                break;
        }
        this.displayPanel();
    }

    finalSequence() {
        /* To-do #43 - Trigger the final sequence
            1 - Disable the fog
            2 - Reconfigure the third-person view camera:
                - horizontal orientation: -180.0
                - vertical orientation: this.thirdPersonViewCamera.initialOrientation.v
                - distance: this.thirdPersonViewCamera.initialDistance
                - zoom factor: 2.0
            3 - Set it as the active view camera
            4 - Set single-view mode:
                - false: single-view
                - true: multiple-views
            5 - Set the final action:
                - action: "Dance"
                - duration: 0.2 seconds*/
        this.fog.enabled = false;
        this.thirdPersonViewCamera.setOrientation(new Orientation(-180.0, this.thirdPersonViewCamera.initialOrientation.v));
        this.thirdPersonViewCamera.setDistance(this.thirdPersonViewCamera.initialDistance);
        this.thirdPersonViewCamera.setZoom(2);
        this.setActiveViewCamera(this.thirdPersonViewCamera);
        this.setViewMode(false);
        this.animations.fadeToAction("Dance", 0.2);
    }

    collision(position) {
        // Check if the player collided with a wall
        const wallCollision = this.maze.distanceToWestWall(position) < this.player.radius ||
            this.maze.distanceToEastWall(position) < this.player.radius ||
            this.maze.distanceToNorthWall(position) < this.player.radius ||
            this.maze.distanceToSouthWall(position) < this.player.radius;

        // Check if the player collided with any doors (add this part)
        const doorCollision = this.maze.distanceToDoor(position) < this.player.radius;

        // Return true if there is a wall collision or a door collision
        return wallCollision || doorCollision;
    }



    stopPlayerMovement() {
        this.activeKeys.clear(); // Limpa todas as teclas ativas
        this.player.isMoving = false; // Adicione uma flag que impede a atualização de movimento
    }

    /* collision(position) {
        // Check if the player collided with a wall
        const wallCollision = this.maze.distanceToWestWall(position) < this.player.radius ||
            this.maze.distanceToEastWall(position) < this.player.radius ||
            this.maze.distanceToNorthWall(position) < this.player.radius ||
            this.maze.distanceToSouthWall(position) < this.player.radius;

        // Check if the player collided with any doors (add this part)
        const doorCollision = this.maze.distanceToDoor(position) < this.player.radius;

        // Return true if there is a wall collision or a door collision
        return wallCollision || doorCollision;
    }
*/


    exitModelView(position) {
        // Check if player collides with the exit door
        const exitDoorCollision = (this.maze.distanceToExitDoor(position)*3)  < this.player.radius;

        if (exitDoorCollision) {
            // Show the exit menu
            this.showExitMenu();
            this.stopPlayerMovement();
            return true; // Indicate that a collision occurred
        }
        return exitDoorCollision;
    }

    showExitMenu() {
        if (this.exitMenu) {
            this.exitMenu.style.display = "block";
        }
    }

    exitGame() {
        // Logic to exit the game and present the main menu
        console.log("Exiting game and presenting main menu...");
        window.location.href = "/index.html";
    }

    continueGame() {
        // Logic to continue the game
        console.log("Continuing game...");
        if (this.exitMenu) {
            this.exitMenu.style.display = "none";
        }
    }


    update() {
        if (!this.gameRunning) {
            if (this.maze.loaded && this.player.loaded) { // If all resources have been loaded
                // Add the maze, the player and the lights to the scene
                this.scene3D.add(this.maze.object);
                this.scene3D.add(this.player.object);
                this.scene3D.add(this.lights.object);

                // Create the clock
                this.clock = new THREE.Clock();

                // Create model animations (states, emotes and expressions)
                this.animations = new Animations(this.player.object, this.player.animations);

                // Set the player's position and direction
                this.player.position = this.maze.initialPosition.clone();
                this.player.direction = this.maze.initialDirection;

                // Create the user interface
                this.userInterface = new UserInterface(this.scene3D, this.renderer, this.lights, this.fog, this.player.object, this.animations);

                // Start the game
                this.gameRunning = true;
            }
        } else {
            // Update the model animations
            const deltaT = this.clock.getDelta();
            this.animations.update(deltaT);

            // Update the player
            if (!this.animations.actionInProgress) {
                let coveredDistance = this.player.walkingSpeed * deltaT;
                let directionIncrement = this.player.turningSpeed * deltaT;
                if (this.player.keyStates.run) {
                    coveredDistance *= this.player.runningFactor;
                    directionIncrement *= this.player.runningFactor;
                }
                if (this.player.keyStates.left) { // The player is turning left
                    this.player.direction += directionIncrement;
                } else if (this.player.keyStates.right) { // The player is turning right
                    this.player.direction -= directionIncrement;
                }
                const direction = THREE.MathUtils.degToRad(this.player.direction);
                if (this.player.keyStates.backward) { // The player is moving backward
                    const newPosition = new THREE.Vector3(-coveredDistance * Math.sin(direction) + this.player.position.x, this.player.position.y, -coveredDistance * Math.cos(direction) + this.player.position.z);
                    if (this.collision(newPosition) || this.exitModelView(newPosition)) {
                        this.animations.fadeToAction("Death", 0.2);
                        this.player.moveSound.pause();
                        this.player.hitWallSound.play();
                    } else {
                        this.animations.fadeToAction(this.player.keyStates.run ? "Running" : "Walking", 0.2);
                        this.player.position = newPosition;
                    }
                } else if (this.player.keyStates.forward ) { // The player is moving forward
                    const newPosition = new THREE.Vector3(coveredDistance * Math.sin(direction) + this.player.position.x, this.player.position.y, coveredDistance * Math.cos(direction) + this.player.position.z);
                    if (this.collision(newPosition) || this.exitModelView(newPosition)) {
                        this.animations.fadeToAction("Death", 0.2);
                        this.player.moveSound.pause();
                        this.player.hitWallSound.play();
                    } else {
                        this.animations.fadeToAction(this.player.keyStates.run ? "Running" : "Walking", 0.2);
                        this.player.position = newPosition;
                    }
                } else if (this.player.keyStates.jump) {
                    this.animations.fadeToAction("Jump", 0.2);
                } else if (this.player.keyStates.yes) {
                    this.animations.fadeToAction("Yes", 0.2);
                } else if (this.player.keyStates.no) {
                    this.animations.fadeToAction("No", 0.2);
                } else if (this.player.keyStates.wave) {
                    this.animations.fadeToAction("Wave", 0.2);
                } else if (this.player.keyStates.punch) {
                    this.animations.fadeToAction("Punch", 0.2);
                } else if (this.player.keyStates.thumbsUp) {
                    this.animations.fadeToAction("ThumbsUp", 0.2);
                } else {
                    this.animations.fadeToAction("Idle", this.animations.previousAction == "Death" ? 0.6 : 0.2);
                }
                this.player.object.position.copy(this.player.position);
                this.player.object.rotation.y = direction - this.player.initialDirection;
            }

            // Update first-person, third-person and top view cameras parameters (player direction and target)
            this.firstPersonViewCamera.playerDirection = this.player.direction;
            this.thirdPersonViewCamera.playerDirection = this.player.direction;
            this.topViewCamera.playerDirection = this.player.direction;
            const target = new THREE.Vector3(this.player.position.x, this.player.position.y + this.player.eyeHeight, this.player.position.z);
            this.firstPersonViewCamera.setTarget(target);
            this.thirdPersonViewCamera.setTarget(target);
            this.topViewCamera.setTarget(target);

            // Update statistics
            this.statistics.update();

            // Render primary viewport(s)
            this.renderer.clear();

            if (this.fog.enabled) {
                this.scene3D.fog = this.fog.object;
            } else {
                this.scene3D.fog = null;
            }
            let cameras;
            if (this.multipleViewsCheckBox.checked) {
                cameras = [this.fixedViewCamera, this.firstPersonViewCamera, this.thirdPersonViewCamera, this.topViewCamera];
            } else {
                cameras = [this.activeViewCamera];
            }
            for (const camera of cameras) {
                this.player.object.visible = (camera != this.firstPersonViewCamera);
                const viewport = camera.getViewport();
                this.renderer.setViewport(viewport.x, viewport.y, viewport.width, viewport.height);
                this.renderer.render(this.scene3D, camera.object);
                this.renderer.render(this.scene2D, this.camera2D);
                this.renderer.clearDepth();
            }

            // Render secondary viewport (mini-map)
            if (this.miniMapCheckBox.checked) {
                this.scene3D.fog = null;
                this.player.object.visible = true;
                const viewport = this.miniMapCamera.getViewport();
                this.renderer.setViewport(viewport.x, viewport.y, viewport.width, viewport.height);
                this.renderer.render(this.scene3D, this.miniMapCamera.object);
                this.renderer.render(this.scene2D, this.camera2D);
            }
        }
    }


    dispose() {
        // Dispose of the renderer and other resources
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.scene) {
            this.scene.children.forEach((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach((material) => material.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
                this.scene.remove(child);
            });
        }
        // Dispose of the user interface if it exists
        if (this.userInterface) {
            this.userInterface.dispose();
        }
    }

}
