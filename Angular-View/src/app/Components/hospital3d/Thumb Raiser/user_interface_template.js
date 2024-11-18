import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

export default class UserInteraction {
    constructor(scene, renderer, lights, fog, object, animations) {

        function colorCallback(object, color) {
            object.color.set(color);
        }

        function shadowsCallback(enabled) {
            scene.traverseVisible(function (child) { // Modifying the scene graph inside the callback is discouraged: https://threejs.org/docs/index.html?q=object3d#api/en/core/Object3D.traverseVisible
                if (child.material) {
                    if (child.material instanceof THREE.Material) {
                        child.material.needsUpdate = true;
                    }
                    else if (child.material instanceof Array) {
                        child.material.forEach(element => {
                            if (element instanceof THREE.Material) {
                                element.needsUpdate = true;
                            }
                        });
                    }
                }
            });
        }

        function createEmoteCallback(animations, name) {
            callbacks[name] = function () {
                animations.fadeToAction(name, 0.2);
            };
            emotesFolder.add(callbacks, name);
        }

        // Create the graphical user interface
        this.gui = new GUI({ hideable: false });

        // Create the lights folder
        const lightsFolder = this.gui.addFolder("Lights");

        // Create the ambient light folder
        const ambientLightFolder = lightsFolder.addFolder("Ambient light");
        ambientLightFolder.add(lights.object.ambientLight, "visible").listen();
        const ambientLight = lights.object.ambientLight;
        const ambientColor = { color: "#" + new THREE.Color(ambientLight.color).getHexString() };
        ambientLightFolder.addColor(ambientColor, "color").onChange(color => colorCallback(ambientLight, color));
        ambientLightFolder.add(lights.object.ambientLight, "intensity", 0.0, 1.0, 0.01);

        // Create the directional light folder
        const directionalLightFolder = lightsFolder.addFolder("Directional light");
        directionalLightFolder.add(lights.object.directionalLight, "visible").listen();
        const directionalLight = lights.object.directionalLight;
        const directionalColor = { color: "#" + new THREE.Color(directionalLight.color).getHexString() };
        directionalLightFolder.addColor(directionalColor, "color").onChange(color => colorCallback(directionalLight, color));
        directionalLightFolder.add(lights.object.directionalLight, "intensity", 0.0, 1.0, 0.01);
        directionalLightFolder.add(lights.object.directionalLight.position, "x", -100, 100, 0.01);
        directionalLightFolder.add(lights.object.directionalLight.position, "y", -100, 100, 0.01);
        directionalLightFolder.add(lights.object.directionalLight.position, "z", -100, 100, 0.01);

        // Create point light #1 folder
        const pointLight1Folder = lightsFolder.addFolder("Point light #1");
        pointLight1Folder.close();
        pointLight1Folder.add(lights.object.pointLight1, "visible").listen();
        const pointLight1 = lights.object.pointLight1;
        const pointColor1 = { color: "#" + new THREE.Color(pointLight1.color).getHexString() };
        pointLight1Folder.addColor(pointColor1, "color").onChange(color => colorCallback(pointLight1, color));
        pointLight1Folder.add(lights.object.pointLight1, "intensity", 0.0, 100.0, 1.0);
        pointLight1Folder.add(lights.object.pointLight1, "distance", 0.0, 20.0, 0.01);
        pointLight1Folder.add(lights.object.pointLight1.position, "x", -10.0, 10.0, 0.01);
        pointLight1Folder.add(lights.object.pointLight1.position, "y", 0.0, 20.0, 0.01);
        pointLight1Folder.add(lights.object.pointLight1.position, "z", -10.0, 10.0, 0.01);

        // Create point light #2 folder
        const pointLight2Folder = lightsFolder.addFolder("Point light #2");
        pointLight2Folder.close();
        pointLight2Folder.add(lights.object.pointLight2, "visible").listen();
        const pointLight2 = lights.object.pointLight2;
        const pointColor2 = { color: "#" + new THREE.Color(pointLight2.color).getHexString() };
        pointLight2Folder.addColor(pointColor2, "color").onChange(color => colorCallback(pointLight2, color));
        pointLight2Folder.add(lights.object.pointLight2, "intensity", 0.0, 100.0, 1.0);
        pointLight2Folder.add(lights.object.pointLight2, "distance", 0.0, 20.0, 0.01);
        pointLight2Folder.add(lights.object.pointLight2.position, "x", -10.0, 10.0, 0.01);
        pointLight2Folder.add(lights.object.pointLight2.position, "y", 0.0, 20.0, 0.01);
        pointLight2Folder.add(lights.object.pointLight2.position, "z", -10.0, 10.0, 0.01);

        // Create the shadows folder
        const shadowsFolder = this.gui.addFolder("Shadows");
        shadowsFolder.add(renderer.shadowMap, "enabled").onChange(enabled => shadowsCallback(enabled));

        // Create the character folder
        const characterFolder = this.gui.addFolder("Character");

        // Create the emotes folder and add emotes
        const emotesFolder = characterFolder.addFolder("Emotes");
        const callbacks = [];
        for (let i = 0; i < animations.emotes.length; i++) {
            createEmoteCallback(animations, animations.emotes[i]);
        }

        // Create the expressions folder and add expressions
        const expressionsFolder = characterFolder.addFolder("Expressions");
        const face = object.getObjectByName("Head_4");
        const expressions = Object.keys(face.morphTargetDictionary);
        for (let i = 0; i < expressions.length; i++) {
            expressionsFolder.add(face.morphTargetInfluences, i, 0.0, 1.0, 0.01).name(expressions[i]);
        }
    }

    setVisibility(visible) {
        if (visible) {
            this.gui.show();
        }
        else {
            this.gui.hide();
        }
    }
}
