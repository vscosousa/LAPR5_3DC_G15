import * as THREE from "three";

/*
 * parameters = {
 *  textureUrl: String,
 *  width: Number,      // Width of the wall
 *  height: Number,     // Height of the wall
 *  thickness: Number,  // Thickness of the wall
 *  bumpMapUrl: String, // Optional: URL for bump map texture
 *  normalMapUrl: String, // Optional: URL for normal map texture
 *  aoMapUrl: String,   // Optional: URL for ambient occlusion map texture
 * }
 */

export default class Wall {
    constructor(parameters) {
        // Default values
        const {
            textureUrl,
            bumpMapUrl,
            normalMapUrl,
            aoMapUrl,
            width = 1.0,
            height = 3.0,
            thickness = 0.05
        } = parameters;

        // Load textures
        const texture = new THREE.TextureLoader().load(textureUrl);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;

        const bumpMap = bumpMapUrl ? new THREE.TextureLoader().load(bumpMapUrl) : null;
        const normalMap = normalMapUrl ? new THREE.TextureLoader().load(normalMapUrl) : null;
        const aoMap = aoMapUrl ? new THREE.TextureLoader().load(aoMapUrl) : null;

        // Create shared material
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            map: texture,
            bumpMap: bumpMap,
            bumpScale: 0.1, // Adjust bump intensity
            normalMap: normalMap,
            aoMap: aoMap,
            side: THREE.DoubleSide
        });

        // Create the wall group
        this.object = new THREE.Group();

        // Add all components
        this.addFrontBackFaces(width, height, thickness, material);
        this.addSideFaces(width, height, thickness, material);
        this.addTopFace(width, thickness, material);
        this.addBottomFace(width, thickness, material);
        this.addTopCover(width, thickness, material);
    }

    addFrontBackFaces(width, height, thickness, material) {
        const geometry = new THREE.PlaneGeometry(width, height);
        geometry.setAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2));

        // Front face
        const frontFace = new THREE.Mesh(geometry, material);
        frontFace.position.set(0, 0, thickness / 2);
        frontFace.castShadow = true;
        frontFace.receiveShadow = true;
        this.object.add(frontFace);

        // Back face
        const backFace = new THREE.Mesh(geometry, material);
        backFace.position.set(0, 0, -thickness / 2);
        backFace.rotation.y = Math.PI;
        backFace.castShadow = true;
        backFace.receiveShadow = true;
        this.object.add(backFace);
    }

    addSideFaces(width, height, thickness, material) {
        const geometry = new THREE.PlaneGeometry(thickness, height);
        geometry.setAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2));

        // Left side face
        const leftFace = new THREE.Mesh(geometry, material);
        leftFace.position.set(-width / 2, 0, 0);
        leftFace.rotation.y = Math.PI / 2;
        leftFace.castShadow = true;
        leftFace.receiveShadow = true;
        this.object.add(leftFace);

        // Right side face
        const rightFace = new THREE.Mesh(geometry, material);
        rightFace.position.set(width / 2, 0, 0);
        rightFace.rotation.y = -Math.PI / 2;
        rightFace.castShadow = true;
        rightFace.receiveShadow = true;
        this.object.add(rightFace);
    }

    addTopFace(width, thickness, material) {
        const geometry = new THREE.PlaneGeometry(width, thickness);
        geometry.setAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2));

        const topFace = new THREE.Mesh(geometry, material);
        topFace.rotation.x = -Math.PI / 2;
        topFace.position.set(0, thickness / 2, 0);
        topFace.castShadow = true;
        topFace.receiveShadow = true;
        this.object.add(topFace);
    }

    addBottomFace(width, thickness, material) {
        const geometry = new THREE.PlaneGeometry(width, thickness);
        geometry.setAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2));

        const bottomFace = new THREE.Mesh(geometry, material);
        bottomFace.rotation.x = Math.PI / 2;
        bottomFace.position.set(0, -thickness / 2, 0);
        bottomFace.castShadow = true;
        bottomFace.receiveShadow = true;
        this.object.add(bottomFace);
    }

    addTopCover(width, thickness, material) {
        const geometry = new THREE.PlaneGeometry(width, thickness);
        geometry.setAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2));

        const cover = new THREE.Mesh(geometry, material);
        cover.rotation.x = Math.PI / 2;
        cover.position.set(0, thickness / 2, 0);
        cover.castShadow = true;
        cover.receiveShadow = true;
        this.object.add(cover);
    }
}
