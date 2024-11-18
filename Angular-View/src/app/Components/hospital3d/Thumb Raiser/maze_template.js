import * as THREE from "three";
import Ground from "./ground_template.js";
import Wall from "./wall_template.js";
import Door from "./door_template.js";
import Table from "./table.js";
import Human from "./human.js";

/*
 * parameters = {
 *  url: String,
 *  credits: String,
 *  scale: Vector3
 * }
 */

export default class Maze {
    constructor(parameters, doorParameters, tableParameters, humanParameters) {
        this.onLoad = function (description) {
            // Store the maze's map and size
            this.map = description.map;
            this.doorMap = description.doorMap;
            this.size = description.size;
            this.doorParameters = doorParameters;
            this.tableParameters = tableParameters;
            this.humanParameters = humanParameters;

            // Store the player's initial position and direction
            this.initialPosition = this.cellToCartesian(description.initialPosition);
            this.initialDirection = description.initialDirection;

            // Create a group of objects
            this.object = new THREE.Group();

            // Create the ground
            this.ground = new Ground({ textureUrl: description.groundTextureUrl, size: description.size });
            this.object.add(this.ground.object);

            // Create a wall
            this.wall = new Wall({ textureUrl: description.wallTextureUrl });

            // Build the maze
            let wallObject;
            let doorObject;
            let tableObject;
            let humanObject;
            for (let i = 0; i <= description.size.width; i++) { // In order to represent the eastmost walls, the map width is one column greater than the actual maze width
                for (let j = 0; j <= description.size.height; j++) { // In order to represent the southmost walls, the map height is one row greater than the actual maze height
                    /*
                     * description.map[][] | North wall | West wall
                     * --------------------+------------+-----------
                     *          0          |     No     |     No
                     *          1          |     No     |    Yes
                     *          2          |    Yes     |     No
                     *          3          |    Yes     |    Yes
                     */
                    /* To-do #5 - Create the north walls
                        - cell coordinates: i (column) and j (row)
                        - map: description.map[][]
                        - maze width: description.size.width
                        - maze height: description.size.height*/
                    if (description.map[j][i] == 2 || description.map[j][i] == 3) {
                        wallObject = this.wall.object.clone();
                        wallObject.position.set(i - description.size.width / 2 + 0.5, 0.5, j - description.size.height / 2);
                        this.object.add(wallObject);
                    }
                    /* To-do #6 - Create the west walls
                        - cell coordinates: i (column), j (row)
                        - map: description.map[][]
                        - maze width: description.size.width
                        - maze height: description.size.height*/
                    if (description.map[j][i] == 1 || description.map[j][i] == 3) {
                        wallObject = this.wall.object.clone();
                        wallObject.rotateY(Math.PI / 2.0);
                        wallObject.position.set(i - description.size.width / 2, 0.5, j - description.size.height / 2 + 0.5);
                        this.object.add(wallObject);
                    }

                    if (description.doorMap[j][i] == 1 || description.doorMap[j][i] == 2) {
                        doorObject = this.door = new Door(this.doorParameters);
                        doorObject.object.position.set(i - description.size.width / 2 + 0.5, 0.5, j - description.size.height / 2);
                        doorObject.object.scale.set(0.0035,0.00635,0);
                        doorObject.object.translateY(-0.6);
                        //se a porta estiver na parede norte
                        if(description.map[j][i] == 1){
                        doorObject.object.translateZ(0.3);
                        }
                        //se a porta estiver na parede sul
                        if(description.map[j][i] == 2){
                        doorObject.object.translateZ(-0.029);
                        }
                        this.object.add(doorObject.object);
                    }
                    if(description.tableMap[j][i] == 1) {
                        tableObject = this.table = new Table(this.tableParameters);
                        tableObject.object.position.set(i - description.size.width / 2 + 0.5, 0.5, j - description.size.height / 2);
                        tableObject.object.scale.set(1, 0.68, 1);
                        tableObject.object.translateX(-0.6);
                        tableObject.object.translateY(-0.2);
                        this.object.add(tableObject.object);

                        humanObject = this.human = new Human(this.humanParameters);
                        humanObject.object.position.set(i - description.size.width / 2 + 0.5, 0.5, j - description.size.height / 2);
                        humanObject.object.scale.set(1.2, 1, 1);
                        humanObject.object.rotateX(Math.PI / 2.0);
                        humanObject.object.rotateY((Math.PI / 2.0)*2);
                        humanObject.object.rotateZ((Math.PI/2.0));
                        humanObject.object.translateY(-1.5);
                        humanObject.object.translateZ(0.47);
                        this.object.add(humanObject.object);
                    }  
                }
            }

            this.object.scale.set(this.scale.x, this.scale.y, this.scale.z);
            
            this.loaded = true;
        }

        this.onProgress = function (url, xhr) {
            console.log("Resource '" + url + "' " + (100.0 * xhr.loaded / xhr.total).toFixed(0) + "% loaded.");
        }

        this.onError = function (url, error) {
            console.error("Error loading resource " + url + " (" + error + ").");
        }

        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }
        this.loaded = false;

        // The cache must be enabled; additional information available at https://threejs.org/docs/api/en/loaders/FileLoader.html
        THREE.Cache.enabled = true;

        // Create a resource file loader
        const loader = new THREE.FileLoader();

        // Set the response type: the resource file will be parsed with JSON.parse()
        loader.setResponseType("json");

        // Load a maze description resource file
        loader.load(
            //Resource URL
            this.url,

            // onLoad callback
            description => this.onLoad(description),

            // onProgress callback
            xhr => this.onProgress(this.url, xhr),

            // onError callback
            error => this.onError(this.url, error)
        );
    }

    // Convert cell [row, column] coordinates to cartesian (x, y, z) coordinates
    cellToCartesian(position) {
        return new THREE.Vector3((position[1] - this.size.width / 2.0 + 0.5) * this.scale.x, 0.0, (position[0] - this.size.height / 2.0 + 0.5) * this.scale.z)
    }

    // Convert cartesian (x, y, z) coordinates to cell [row, column] coordinates
    cartesianToCell(position) {
        return [Math.floor(position.z / this.scale.z + this.size.height / 2.0), Math.floor(position.x / this.scale.x + this.size.width / 2.0)];
    }

    /* To-do #23 - Measure the player’s distance to the walls
        - player position: position*/
    distanceToWestWall(position) {
        const indices = this.cartesianToCell(position);
        if (this.map[indices[0]][indices[1]] == 1 || this.map[indices[0]][indices[1]] == 3) {
            return position.x - this.cellToCartesian(indices).x + this.scale.x / 2.0;
        }
        return Infinity;
    }

    distanceToEastWall(position) {
        const indices = this.cartesianToCell(position);
        indices[1]++;
        if (this.map[indices[0]][indices[1]] == 1 || this.map[indices[0]][indices[1]] == 3) {
            return this.cellToCartesian(indices).x - this.scale.x / 2.0 - position.x;
        }
        return Infinity;
    }

    distanceToNorthWall(position) {
        const indices = this.cartesianToCell(position);
        if (this.map[indices[0]][indices[1]] == 2 || this.map[indices[0]][indices[1]] == 3) {
            return position.z - this.cellToCartesian(indices).z + this.scale.z / 2.0;
        }
        if(this.doorMap[indices[0]][indices[1]] == 1 || this.doorMap[indices[0]][indices[1]] == 2) {
            return position.z - this.cellToCartesian(indices).z + this.scale.z / 2.0;
        }
        return Infinity;
    }

    distanceToSouthWall(position) {
        const indices = this.cartesianToCell(position);
        indices[0]++;
        if (this.map[indices[0]][indices[1]] == 2 || this.map[indices[0]][indices[1]] == 3) {
            return this.cellToCartesian(indices).z - this.scale.z / 2.0 - position.z;
        }
        if(this.doorMap[indices[0]][indices[1]] == 1 || this.doorMap[indices[0]][indices[1]] == 2) {
            return this.cellToCartesian(indices).z - this.scale.z / 2.0 - position.z;
        }
        return Infinity;
    }

    getDoor() {
        return this.door;
    }
}