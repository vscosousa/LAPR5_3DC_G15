export default class RoomInfoHandler {

    constructor(roomParameters) {
        this.selectedRoom = null;
        this.isInfoVisible = false;
        this.roomParameters = roomParameters;

        // Initialize the toggle info sound with volume control
        this.toggleInfoSound = new Audio("audios/i.mp3");
        console.log("Sound loaded: " + this.toggleInfoSound.src);
        this.toggleInfoSound.loop = false;
        this.toggleInfoSound.volume = 0.3; // Set the volume to 30% (adjust as necessary)

        this.toggleHeartMonitorSound = new Audio("audios/heartbit.mp3");
        this.toggleHeartMonitorSound.loop = true;

        this.initKeyboardListener();
    }

    playToggleInfoSound() {
        if (this.selectedRoom) {  // Check if a room is selected
            if (this.toggleInfoSound) {
                // Reset the sound to the beginning every time it plays
                if (!this.toggleInfoSound.paused) {
                    this.toggleInfoSound.currentTime = 0;  // Stop the sound immediately
                }
        
                this.toggleInfoSound.play().catch((error) => {
                    console.error("Error playing sound:", error);
                });
            }
        }
    }

    playToggleHeartMonitorSound() {
        if (this.selectedRoom && this.selectedRoom.isOccupied) {  // Check if a room is selected and occupied
            if (this.toggleHeartMonitorSound) {
                // Reset the sound to the beginning every time it plays
                if (!this.toggleHeartMonitorSound.paused) {
                    this.toggleHeartMonitorSound.currentTime = 0;  // Stop the sound immediately
                }
        
                this.toggleHeartMonitorSound.play().catch((error) => {
                    console.error("Error playing sound:", error);
                });
            }
        }
    }

    getRoomFromTable(table) {
        const tableName = table.name;
        console.log("getRoomFromTable:" + tableName);

        const tableIndexMap = {
            "Table_2_2": 0,
            "Table_2_8": 1,
            "Table_8_2": 2,
            "Table_8_8": 3
        };

        const index = tableIndexMap[tableName];
        if (index === undefined) {
            console.error(`Table name ${tableName} is not recognized`);
            return null;
        }

        if (this.roomParameters && Array.isArray(this.roomParameters) && this.roomParameters.length > index) {
            return this.roomParameters[index];
        } else {
            console.error("roomParameters is not defined, not an array, or out of range");
            return null;
        }
    }

    selectRoomFromTable(table) {
        const room = this.getRoomFromTable(table);
        if (!room) {
            console.error(`Room not found for table: ${table}`);
            this.deselectRoom();
            return;
        }
        this.selectedRoom = room;
        this.playToggleHeartMonitorSound();
        console.log(`Room selected: ${room.roomNumber}`);
        if (this.isInfoVisible) {
            this.updateRoomInfo();
        }
    }

    deselectRoom() {
        console.log("Deselecting room...");
        this.selectedRoom = null;
        this.clearRoomInfo();
        this.toggleHeartMonitorSound.pause();
    }

    clearRoomInfo() {
        const infoDiv = document.getElementById("room-info");
        if (infoDiv) {
            infoDiv.innerHTML = `
                <h3>Room Information</h3>
                <p>No room selected.</p>
            `;
            infoDiv.style.display = "none";
            this.isInfoVisible = false;
        }
    }

    toggleRoomInfo() {
        if (!this.selectedRoom) {
            alert("No room selected!");
            return;
        }

        const infoDiv = document.getElementById("room-info") || this.createInfoDiv();

        if (this.isInfoVisible) {
            infoDiv.style.display = "none";
            this.isInfoVisible = false;
        } else {
            this.updateRoomInfo();
            infoDiv.style.display = "block";
            this.isInfoVisible = true;
        }
    }

    updateRoomInfo() {
        const infoDiv = document.getElementById("room-info");
        if (infoDiv && this.selectedRoom) {
            const room = this.selectedRoom;
            infoDiv.innerHTML = `
                <h3>Room Information</h3>
                <p><strong>Number:</strong> ${room.roomNumber}</p>
                <p><strong>Capacity:</strong> ${room.capacity}</p>
                <p><strong>Occupied:</strong> ${room.isOccupied ? "Yes" : "No"}</p>
            `;
        }
    }

    initKeyboardListener() {
        document.addEventListener("keydown", (event) => {
            if (event.key.toLowerCase() === "i") {
                this.toggleRoomInfo();
                this.playToggleInfoSound();

            }
        });
    }

    handlePlayerLeavingRoom() {
        console.log("Player has left the room.");
        this.deselectRoom();
    }

    createInfoDiv() {
        const infoDiv = document.createElement("div");
        infoDiv.id = "room-info";
        infoDiv.style.position = "absolute";
        infoDiv.style.top = "10px";
        infoDiv.style.left = "10px";
        infoDiv.style.padding = "15px";
        infoDiv.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        infoDiv.style.color = "white";
        infoDiv.style.borderRadius = "5px";
        infoDiv.style.zIndex = "1000";
        infoDiv.style.display = "none";
        document.body.appendChild(infoDiv);
        return infoDiv;
    }
}