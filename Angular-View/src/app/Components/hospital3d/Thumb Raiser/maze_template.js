import * as THREE from "three";
import Ground from "./ground_template.js";
import Wall from "./wall_template.js";
import Door from "./door_template.js";
import Table from "./table.js";
import Human from "./human.js";
import ExitDoor from "./exitDoor.js";
import { consumerPollProducersForChange } from "@angular/core/primitives/signals";

/*
 * parameters = {
 *  url: String,
 *  credits: String,
 *  scale: Vector3
 * }
 */

export default class Maze {
    constructor(parameters, doorParameters, tableParameters, humanParameters, exitDoorParameters, roomParameters) {
        this.onLoad = function (description) {
            // Store the maze's map and size
            this.map = description.map;
            this.doorMap = description.doorMap;
            this.tableMap = description.tableMap;
            this.size = description.size;
            this.doorParameters = doorParameters;
            this.tableParameters = tableParameters;
            this.humanParameters = humanParameters;
            this.exitDoorParameters = exitDoorParameters;
            this.roomParameters = roomParameters;

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
            for (let j = 0; j <= description.size.height; j++) {
                for (let i = 0; i <= description.size.width; i++) {
                    // Determine the current room based on tile position
                    let roomIndex;
                    const midHeight = Math.floor(description.size.height / 2);
                    const midWidth = Math.floor(description.size.width / 2);

                    if (j < midHeight && i < midWidth) {
                        roomIndex = 0; // Top-left quadrant
                    } else if (j < midHeight && i >= midWidth) {
                        roomIndex = 1; // Top-right quadrant
                    } else if (j >= midHeight && i < midWidth) {
                        roomIndex = 2; // Bottom-left quadrant
                    } else {
                        roomIndex = 3; // Bottom-right quadrant
                    }

                    const currentRoom = roomParameters[roomIndex];

                    // Create north walls
                    if (description.map[j][i] === 2 || description.map[j][i] === 3) {
                        const wallObject = this.wall.object.clone();
                        wallObject.position.set(
                            i - description.size.width / 2 + 0.5,
                            0.5,
                            j - description.size.height / 2
                        );
                        this.object.add(wallObject);
                    }

                    // Create west walls
                    if (description.map[j][i] === 1 || description.map[j][i] === 3) {
                        const wallObject = this.wall.object.clone();
                        wallObject.rotateY(Math.PI / 2.0);
                        wallObject.position.set(
                            i - description.size.width / 2,
                            0.5,
                            j - description.size.height / 2 + 0.5
                        );
                        this.object.add(wallObject);
                    }

                    // Add doors (only if the room is occupied)
                    if (description.map[j][i] === 4 && !currentRoom.isOccupied) {
                        const doorObject = new Door(this.doorParameters);
                        doorObject.object.position.set(
                            i - description.size.width / 2 + 0.5,
                            0.5,
                            j - description.size.height / 2
                        );
                        doorObject.object.scale.set(0.0035, 0.00635, 0);
                        doorObject.object.translateY(-0.6);
                        doorObject.object.translateX(0.5);


                        // Adjust door positioning based on the wall
                        if (description.doorMap[j][i] === 1) {
                            doorObject.object.rotateY(-Math.PI / 2);
                        } else if (description.doorMap[j][i] === 2) {
                            doorObject.object.translateZ(-0.029); // Door on the south wall
                            doorObject.object.rotateY(Math.PI / 2);

                        }

                        this.object.add(doorObject.object);
                    }

                    if (description.map[j][i] === 4 && currentRoom.isOccupied) {
                        const doorObject = new Door(this.doorParameters);
                        doorObject.object.position.set(
                            i - description.size.width / 2 + 0.5,
                            0.5,
                            j - description.size.height / 2
                        );
                        doorObject.object.scale.set(0.0035, 0.00635, 0);
                        doorObject.object.translateY(-0.6);
                        doorObject.object.translateX(0.5);

                        // Adjust door positioning based on the wall
                        if (description.map[j][i] === 1) {
                            doorObject.object.translateZ(0.3); // Door on the north wall
                        } else if (description.map[j][i] === 2) {
                            doorObject.object.translateZ(-0.029); // Door on the south wall
                        }

                        this.object.add(doorObject.object);
                    }


                    // Add tables and humans
                    if (this.map[j][i] === 5) {
                        

                        // Create a table instance
                        const tableObject = new Table({
                            url: this.tableParameters.url, // Path to the table model
                            scale: new THREE.Vector3(0.5, 1, 0.5), // Adjust scale as needed
                            name: `Table_${j}_${i}` // Unique identifier for the table
                        });

                        console.log("Table added: " +  tableObject.name)

                        // Position the table in the scene
                        tableObject.object.position.set(
                            i - description.size.width / 2 + 0.5,
                            0.5,
                            j - description.size.height / 2
                        );
                        tableObject.object.scale.set(1, 0.68, 1); // Adjust scale as necessary
                        tableObject.object.translateX(-0.6);
                        tableObject.object.translateY(-0.2);

                        // Add the table to the maze
                        this.object.add(tableObject.object);

                        if (currentRoom.isOccupied) {
                            // Add a human if the room is occupied
                            console.log("Human added: " + currentRoom.isOccupied);

                            const humanObject = new Human(this.humanParameters);
                            humanObject.object.position.set(
                                i - description.size.width / 2 + 0.5,
                                0.5,
                                j - description.size.height / 2
                            );
                            humanObject.object.scale.set(1.2, 1, 1);
                            humanObject.object.rotateY(Math.PI / 2);
                            humanObject.object.translateY(0.29);
                            humanObject.object.translateZ(-0.67);

                            this.object.add(humanObject.object);
                        }
                    }

                    if(this.map[j][i] === 6) {
                        const exitDoorObject = new ExitDoor(this.exitDoorParameters);
                        exitDoorObject.object.position.set(
                            i - description.size.width / 2 + 0.5,
                            0.5,
                            j - description.size.height / 2
                        );
                    
                        exitDoorObject.object.translateX(-0.34);
                        exitDoorObject.object.translateY(-1);
                        exitDoorObject.object.translateZ(-0.05);
                        this.object.add(exitDoorObject.object);
                    }
                }
            }

            // Scale the entire maze
            this.object.scale.set(this.scale.x, this.scale.y, this.scale.z);

            this.loaded = true;
        };
        this.onProgress = function (url, xhr) {
            console.log("Resource '" + url + "' " + (100.0 * xhr.loaded / xhr.total).toFixed(0) + "% loaded.");
        };

        this.onError = function (url, error) {
            console.error("Error loading resource " + url + " (" + error + ").");
        };

        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }
        this.loaded = false;

        THREE.Cache.enabled = true;

        const loader = new THREE.FileLoader();
        loader.setResponseType("json");
        loader.load(
            this.url,
            (description) => this.onLoad(description),
            (xhr) => this.onProgress(this.url, xhr),
            (error) => this.onError(this.url, error)
        );
    }

    cellToCartesian(position) {
        return new THREE.Vector3(
            (position[1] - this.size.width / 2.0 + 0.5) * this.scale.x,
            0.0,
            (position[0] - this.size.height / 2.0 + 0.5) * this.scale.z
        );
    }

    cartesianToCell(position) {
        return [
            Math.floor(position.z / this.scale.z + this.size.height / 2.0),
            Math.floor(position.x / this.scale.x + this.size.width / 2.0)
        ];
    }

    distanceToWestWall(position) {
        const indices = this.cartesianToCell(position);
        if (this.map[indices[0]][indices[1]] === 1 || this.map[indices[0]][indices[1]] === 3) {
            return position.x - this.cellToCartesian(indices).x + this.scale.x / 2.0;
        }
        return Infinity;
    }

    distanceToEastWall(position) {
        const indices = this.cartesianToCell(position);
        indices[1]++;
        if (this.map[indices[0]][indices[1]] === 1 || this.map[indices[0]][indices[1]] === 3) {
            return this.cellToCartesian(indices).x - this.scale.x / 2.0 - position.x;
        }
        return Infinity;
    }

    distanceToNorthWall(position) {
        const indices = this.cartesianToCell(position);
        if (this.map[indices[0]][indices[1]] === 2 || this.map[indices[0]][indices[1]] === 3) {
            return position.z - this.cellToCartesian(indices).z + this.scale.z / 2.0;
        }
        return Infinity;
    }

    distanceToSouthWall(position) {
        const indices = this.cartesianToCell(position);
        indices[0]++;
        if (this.map[indices[0]][indices[1]] === 2 || this.map[indices[0]][indices[1]] === 3) {
            return this.cellToCartesian(indices).z - this.scale.z / 2.0 - position.z;
        }
        return Infinity;
    }

    distanceToDoor(position) {
        const indices = this.cartesianToCell(position);
        indices[0]++;
        const roomIndex = this.getRoomIndex(indices);
        const currentRoom = this.roomParameters[roomIndex];

        // Check if the current room is occupied and the door is closed
        if (this.map[indices[0]][indices[1]] === 4 && currentRoom.isOccupied) {
            return this.cellToCartesian(indices).z - this.scale.z / 2.0 - position.z;
        }
        return Infinity;
    }

    // Helper method to get the room index based on the tile position
    getRoomIndex(indices) {
        const midHeight = Math.floor(this.size.height / 2);
        const midWidth = Math.floor(this.size.width / 2);

        if (indices[0] < midHeight && indices[1] < midWidth) {
            return 0; // Top-left quadrant
        } else if (indices[0] < midHeight && indices[1] >= midWidth) {
            return 1; // Top-right quadrant
        } else if (indices[0] >= midHeight && indices[1] < midWidth) {
            return 2; // Bottom-left quadrant
        } else {
            return 3; // Bottom-right quadrant
        }
    }
}
