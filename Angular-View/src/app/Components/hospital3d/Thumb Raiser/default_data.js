import * as THREE from "three";
import Orientation from "./orientation.js";


export const generalData = {
    setDevicePixelRatio: false
}

export const mazeData = {
    url: "/mazes/Loquitas.json",
    credits: "Maze designed by Cecília Fernandes and Nikita.",
    scale: new THREE.Vector3(1.0, 1.0, 1.0)
}

export const playerData = {
    url: "/models/gltf/RobotExpressive/RobotExpressive.glb",
    credits: "Model and related code snippets created by <a href='https://www.patreon.com/quaternius' target='_blank' rel='noopener'>Tomás Laulhé</a>. CC0 1.0. Modified by <a href='https://donmccurdy.com/' target='_blank' rel='noopener'>Don McCurdy</a>.",
    eyeHeight: 0.8, // fraction of character height
    scale: new THREE.Vector3(0.1, 0.1, 0.1),
    walkingSpeed: 3,
    initialDirection: 0.0, // Expressed in degrees
    turningSpeed: 250.0, // Expressed in degrees / second
    runningFactor: 2.0, // Affects walking speed and turning speed
    keyCodes: { fixedView: "Digit1", firstPersonView: "Digit2", thirdPersonView: "Digit3", topView: "Digit4", viewMode: "KeyV", userInterface: "KeyU", miniMap: "KeyM", help: "KeyH", statistics: "KeyS", run: "KeyR", left: "ArrowLeft", right: "ArrowRight", backward: "ArrowDown", forward: "ArrowUp", jump: "KeyJ", yes: "KeyY", no: "KeyN", wave: "KeyW", punch: "KeyP", thumbsUp: "KeyT" }
}

export const lightsData = {
    ambientLight: { color: 0xffffff, intensity: 1.0 },
    pointLight1: { color: 0xffffff, intensity: 1.0, distance: 0.0, position: new THREE.Vector3(0.0, 0.0, 0.0) },
    pointLight2: { color: 0xffffff, intensity: 1.0, distance: 0.0, position: new THREE.Vector3(0.0, 0.0, 0.0) },
    directionalLight: { color: 0xffffff, intensity: 1.0, position: new THREE.Vector3(0.0, 0.0, 0.0), target: new THREE.Vector3(0.0, 0.0, 0.0) },
    spotLight: { color: 0xffffff, intensity: 1.0, distance: 0.0, angle: Math.PI / 3.0, penumbra: 0.0, position: new THREE.Vector3(0.0, 0.0, 0.0), direction: 0.0 } // angle and direction expressed in radians
}

export const fogData = {
    enabled: false,
    color: 0xe0e0e0,
    near: 0.1,
    far: 14.0
}

export const cameraData = {
    view: "fixed", // Fixed view: "fixed"; first-person view: "first-person"; third-person view: "third-person"; top view: "top"; mini-map: "mini-map"
    multipleViewsViewport: new THREE.Vector4(0.0, 0.0, 1.0, 1.0), // Viewport position and size: fraction of window width and window height; MUST BE REDEFINED when creating an instance of ThumbRaiser() so that each view is assigned a different viewport
    target: new THREE.Vector3(0.0, 0.0, 0.0), // Target position
    initialOrientation: new Orientation(135.0, -45.0), // Horizontal and vertical orientation and associated limits (expressed in degrees)
    orientationMin: new Orientation(-180.0, -90.0),
    orientationMax: new Orientation(180.0, 0.0),
    initialDistance: 8.0, // Distance to the target and associated limits
    distanceMin: 4.0,
    distanceMax: 16.0,
    initialZoom: 1.0, // Zoom factor and associated limits
    zoomMin: 0.5,
    zoomMax: 2.0,
    initialFov: 45.0, // Field-of-view (expressed in degrees)
    near: 0.01, // Front clipping plane
    far: 100.0 // Back clipping plane
}

export const doorData = {
    url: "/models/gltf/RobotExpressive/hospital_door.glb",
    scale: new THREE.Vector3(0.42,0.269, 1) // Adjusted scale to match wall dimensions
}

export const tableData = {
    url: "/models/gltf/RobotExpressive/hospital_bed.glb",
    scale: new THREE.Vector3(0.5, 1, 0.5),
    name: ""
}

export const humanData = {
  url: "/models/gltf/RobotExpressive/patient.glb",
  scale: new THREE.Vector3(0.0045, 0.010, 0.0045) // Adjusted scale to maintain proportions
}

export const exitDoorData = {
    url: "/models/gltf/RobotExpressive/exit_doors.glb",
    scale: new THREE.Vector3(1.35, 1.4, 1.3) // Adjusted scale to match wall dimensions
}

export const hearthMonitorData = {
    url: "/models/gltf/RobotExpressive/monitor_with_heart_rate.glb",
    scale: new THREE.Vector3(0.5, 0.5, 0.5)
}

export const hearthTableData = {
    url: "/models/gltf/RobotExpressive/adjustable_bedside_table.glb",
    scale: new THREE.Vector3(0.5, 0.5, 0.5)
}

export const surgicalEquipmentData = {
    url: "/models/gltf/RobotExpressive/surgical.glb",
    scale: new THREE.Vector3(0.5, 0.5, 0.5)
}

export const surgeonData = {
    url: "/models/gltf/RobotExpressive/surgeon.glb",
    scale: new THREE.Vector3(0.1, 0.1, 0.1)
    
}

