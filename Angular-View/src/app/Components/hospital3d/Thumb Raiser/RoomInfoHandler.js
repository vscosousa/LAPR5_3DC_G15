export default class RoomInfoHandler {
    
    constructor(roomParameters) {
        this.selectedRoom = null; 
        this.isInfoVisible = false;
        this.initKeyboardListener();
        this.roomParameters = roomParameters;
    }

    getRoomFromTable(table) {
        const tableName = table.name;
        console.log("getRoomFromTable:" + tableName);
    
        // Mapping table names to corresponding indices
        const tableIndexMap = {
            "Table_2_2": 0,
            "Table_2_8": 1,
            "Table_8_2": 2,
            "Table_8_8": 3
        };
    
        // Check if tableName exists in the mapping
        const index = tableIndexMap[tableName];
        if (index === undefined) {
            console.error(`Table name ${tableName} is not recognized`);
            return null; // Handle unknown table names
        }
    
        // Check if roomParameters is valid and the index is within range
        if (this.roomParameters && Array.isArray(this.roomParameters) && this.roomParameters.length > index) {
            return this.roomParameters[index];
        } else {
            console.error("roomParameters is not defined, not an array, or out of range");
            return null; // Handle the error as needed
        }
    }
    
    selectRoomFromTable(table) {
        const room = this.getRoomFromTable(table);
        if (!room) {
            console.error(`Room not found for table: ${table}`);
            this.selectedRoom = null; // Clear the selected room
            this.clearRoomInfo(); // Update the room-info div to reflect no room selected
            return;
        }
        this.selectedRoom = room;
        console.log(`Room selected: ${room.roomNumber}`);
        if (this.isInfoVisible) {
            this.updateRoomInfo();
        }
    }

    clearRoomInfo() {
        const infoDiv = document.getElementById("room-info");
        if (infoDiv) {
            infoDiv.innerHTML = `
                <h3>Room Information</h3>
                <p>No room selected.</p>
            `;
            this.isInfoVisible = false; // Ensure the info div is marked as hidden
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
            }
        });
    }

    createInfoDiv() {
        const infoDiv = document.createElement("div");
        infoDiv.id = "room-info";
        infoDiv.style.position = "absolute";
        infoDiv.style.top = "10px";
        infoDiv.style.left = "10px"; // Changed from right to left
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