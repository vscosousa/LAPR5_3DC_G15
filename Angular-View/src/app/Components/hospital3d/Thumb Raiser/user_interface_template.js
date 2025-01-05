import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

export default class UserInteraction {
    constructor(scene, renderer, lights, fog, object, animations) {

        // Callback to update object color
        function colorCallback(object, color) {
            object.color.set(color);
        }

        // Callback to toggle shadows
        function shadowsCallback(enabled) {
            renderer.shadowMap.enabled = enabled;
            scene.traverseVisible(function (child) {
                if (child.material) {
                    if (child.material instanceof THREE.Material) {
                        child.material.needsUpdate = true;
                    }
                    else if (Array.isArray(child.material)) {
                        child.material.forEach(element => {
                            if (element instanceof THREE.Material) {
                                element.needsUpdate = true;
                            }
                        });
                    }
                }
            });
        }

        // Create emote callbacks for character animations
        function createEmoteCallback(animations, name) {
            callbacks[name] = function () {
                animations.fadeToAction(name, 0.2);
            };
            emotesFolder.add(callbacks, name);
        }

        // Create the GUI instance
        this.gui = new GUI({ hideable: false });

        // Lights folder
        const lightsFolder = this.gui.addFolder("Lights");

        // Ambient light folder
        const ambientLightFolder = lightsFolder.addFolder("Ambient light");
        ambientLightFolder.add(lights.object.ambientLight, "visible").listen();
        const ambientLight = lights.object.ambientLight;
        const ambientColor = { color: "#" + new THREE.Color(ambientLight.color).getHexString() };
        ambientLightFolder.addColor(ambientColor, "color").onChange(color => colorCallback(ambientLight, color));
        ambientLightFolder.add(lights.object.ambientLight, "intensity", 0.0, 1.0, 0.01);

        // Directional light folder
        const directionalLightFolder = lightsFolder.addFolder("Directional light");
        directionalLightFolder.add(lights.object.directionalLight, "visible").listen();
        const directionalLight = lights.object.directionalLight;
        const directionalColor = { color: "#" + new THREE.Color(directionalLight.color).getHexString() };
        directionalLightFolder.addColor(directionalColor, "color").onChange(color => colorCallback(directionalLight, color));
        directionalLightFolder.add(lights.object.directionalLight, "intensity", 0.0, 1.0, 0.01);
        directionalLightFolder.add(lights.object.directionalLight.position, "x", -100, 100, 0.01);
        directionalLightFolder.add(lights.object.directionalLight.position, "y", -100, 100, 0.01);
        directionalLightFolder.add(lights.object.directionalLight.position, "z", -100, 100, 0.01);

        // Point light #1 folder
        const pointLight1Folder = lightsFolder.addFolder("Point light #1");
        pointLight1Folder.close();  // Ensure it starts closed
        pointLight1Folder.add(lights.object.pointLight1, "visible").listen();
        const pointLight1 = lights.object.pointLight1;
        const pointColor1 = { color: "#" + new THREE.Color(pointLight1.color).getHexString() };
        pointLight1Folder.addColor(pointColor1, "color").onChange(color => colorCallback(pointLight1, color));
        pointLight1Folder.add(lights.object.pointLight1, "intensity", 0.0, 100.0, 1.0);
        pointLight1Folder.add(lights.object.pointLight1, "distance", 0.0, 20.0, 0.01);
        pointLight1Folder.add(lights.object.pointLight1.position, "x", -10.0, 10.0, 0.01);
        pointLight1Folder.add(lights.object.pointLight1.position, "y", 0.0, 20.0, 0.01);
        pointLight1Folder.add(lights.object.pointLight1.position, "z", -10.0, 10.0, 0.01);

        // Point light #2 folder
        const pointLight2Folder = lightsFolder.addFolder("Point light #2");
        pointLight2Folder.close();  // Ensure it starts closed
        pointLight2Folder.add(lights.object.pointLight2, "visible").listen();
        const pointLight2 = lights.object.pointLight2;
        const pointColor2 = { color: "#" + new THREE.Color(pointLight2.color).getHexString() };
        pointLight2Folder.addColor(pointColor2, "color").onChange(color => colorCallback(pointLight2, color));
        pointLight2Folder.add(lights.object.pointLight2, "intensity", 0.0, 100.0, 1.0);
        pointLight2Folder.add(lights.object.pointLight2, "distance", 0.0, 20.0, 0.01);
        pointLight2Folder.add(lights.object.pointLight2.position, "x", -10.0, 10.0, 0.01);
        pointLight2Folder.add(lights.object.pointLight2.position, "y", 0.0, 20.0, 0.01);
        pointLight2Folder.add(lights.object.pointLight2.position, "z", -10.0, 10.0, 0.01);

        // Shadows folder
        const shadowsFolder = this.gui.addFolder("Shadows");
        shadowsFolder.add(renderer.shadowMap, "enabled").onChange(enabled => shadowsCallback(enabled));

        // Character folder
        const characterFolder = this.gui.addFolder("Character");

        // Emotes folder
        const emotesFolder = characterFolder.addFolder("Emotes");
        const callbacks = [];
        for (let i = 0; i < animations.emotes.length; i++) {
            createEmoteCallback(animations, animations.emotes[i]);
        }

        // Expressions folder
        const expressionsFolder = characterFolder.addFolder("Expressions");
        const face = object.getObjectByName("Head_4");
        const expressions = Object.keys(face.morphTargetDictionary);
        for (let i = 0; i < expressions.length; i++) {
            expressionsFolder.add(face.morphTargetInfluences, i, 0.0, 1.0, 0.01).name(expressions[i]);
        }

        // Ensure GUI is not visible by default
        this.setVisibility(true);
    }

    // Toggle GUI visibility
    setVisibility(visible) {
        if (visible) {
            this.gui.domElement.style.display = 'block';  // Show GUI
        } else {
            this.gui.domElement.style.display = 'none';  // Hide GUI
        }
    }

    // Dispose of the GUI and remove it from the DOM
    dispose() {
        console.log("Disposing of GUI");
        this.gui.destroy();
    }
}