export default class RoomInfoHandler {
    
    
    constructor() {
        this.selectedRoom = null; 
        this.isInfoVisible = false;
        this.initKeyboardListener();
    }

 
    selectRoomFromTable(table) {
        
        const room = this.getRoomFromTable(table);
        this.selectedRoom = room;
        console.log(`Room selected: ${room.name}`); 
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
           
            const room = this.selectedRoom;
            infoDiv.innerHTML = `
                <h3>Room Information</h3>
                <p><strong>Name:</strong> ${room.name}</p>
                <p><strong>Capacity:</strong> ${room.capacity}</p>
                <p><strong>Occupied:</strong> ${room.isOccupied ? "Yes" : "No"}</p>
            `;
            infoDiv.style.display = "block";
            this.isInfoVisible = true;
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
        infoDiv.style.right = "10px";
        infoDiv.style.padding = "15px";
        infoDiv.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        infoDiv.style.color = "white";
        infoDiv.style.borderRadius = "5px";
        infoDiv.style.zIndex = "1000";
        infoDiv.style.display = "none"; 
        document.body.appendChild(infoDiv);
        return infoDiv;
    }

 
    getRoomFromTable(table) {
        
        return {
            name: "Surgery Room 1",
            capacity: 4,
            isOccupied: false,
        };
    }
}


