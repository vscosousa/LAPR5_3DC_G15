import * as THREE from "three";

/*
 * parameters = {
 *  textureUrl: String,
 *  size: Vector2,
 *  shadow: Boolean, // Optional: To control shadow behavior
 *  normalMapUrl: String, // Optional: URL for the normal map
 *  bumpMapUrl: String, // Optional: URL for the bump map
 *  bumpScale: Number // Optional: Scale for the bump map
 * }
 */

export default class Ground {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        // Load the texture
        const texture = new THREE.TextureLoader().load(this.textureUrl);
        texture.colorSpace = THREE.SRGBColorSpace;
        
        // Set the texture wrapping modes (Repeat S and T)
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(this.size.width, this.size.height);

        // Configure magnification and minification filters (Linear for better visuals)
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;

        // Optionally, add normal map for additional texture depth
        let normalMap = null;
        if (this.normalMapUrl) {
            normalMap = new THREE.TextureLoader().load(this.normalMapUrl);
            normalMap.wrapS = THREE.RepeatWrapping;
            normalMap.wrapT = THREE.RepeatWrapping;
            normalMap.repeat.set(this.size.width, this.size.height);
        }

        // Optionally, add bump map for additional texture depth
        let bumpMap = null;
        if (this.bumpMapUrl) {
            bumpMap = new THREE.TextureLoader().load(this.bumpMapUrl);
            bumpMap.wrapS = THREE.RepeatWrapping;
            bumpMap.wrapT = THREE.RepeatWrapping;
            bumpMap.repeat.set(this.size.width, this.size.height);
        }

        // Create the ground geometry and material
        const geometry = new THREE.PlaneGeometry(this.size.width, this.size.height);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            map: texture,
            normalMap: normalMap,
            bumpMap: bumpMap,
            bumpScale: this.bumpScale || 0.1, // Default bump scale if not provided
            roughness: 0.8, // Adjust roughness for more realistic lighting
            metalness: 0.2, // Slight metalness for better interaction with light
        });

        // Create a mesh from geometry and material
        this.object = new THREE.Mesh(geometry, material);
        this.object.rotation.x = -Math.PI / 2; // Rotate ground to lay flat
        this.object.receiveShadow = this.shadow || false; // Receive shadows

        // Set up shadow properties for uniform lighting
        this.object.castShadow = this.shadow || false; // Optionally allow the ground to cast shadows

        // Adjust lighting interactions
        this.object.receiveShadow = true;
    }

    // Optionally, you can add more utility methods or adjust settings at runtime
    setShadow(enable) {
        this.object.castShadow = enable;
    }

    setTextureRepeat(width, height) {
        this.object.material.map.repeat.set(width, height);
        if (this.object.material.normalMap) {
            this.object.material.normalMap.repeat.set(width, height);
        }
        if (this.object.material.bumpMap) {
            this.object.material.bumpMap.repeat.set(width, height);
        }
    }

    updateTexture(textureUrl) {
        const texture = new THREE.TextureLoader().load(textureUrl);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        this.object.material.map = texture;
    }

    updateNormalMap(normalMapUrl) {
        const normalMap = new THREE.TextureLoader().load(normalMapUrl);
        normalMap.wrapS = THREE.RepeatWrapping;
        normalMap.wrapT = THREE.RepeatWrapping;
        this.object.material.normalMap = normalMap;
    }

    updateBumpMap(bumpMapUrl, bumpScale = 0.1) {
        const bumpMap = new THREE.TextureLoader().load(bumpMapUrl);
        bumpMap.wrapS = THREE.RepeatWrapping;
        bumpMap.wrapT = THREE.RepeatWrapping;
        this.object.material.bumpMap = bumpMap;
        this.object.material.bumpScale = bumpScale;
    }
}