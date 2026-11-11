// rooms javascript

// get html elements from rooms page 

// room statistics section
const totalRooms = document.getElementById("totalRooms");
const availableRooms = document.getElementById("availableRooms");
const bookedRooms = document.getElementById("bookedRooms");
const occupiedRooms = document.getElementById("occupiedRooms");

// add roomform section
const roomForm = document.getElementById("roomForm");
const roomNumber = document.getElementById("roomNumber");
const roomType = document.getElementById("roomType");
const roomPrice = document.getElementById("roomPrice");
const roomStatus = document.getElementById("roomStatus");

// search for room
const roomSearch = document.getElementById("roomSearch");

// table for the room list
const roomList = document.getElementById("roomList");

// Get rooms from localStorage
let rooms = JSON.parse(localStorage.getItem("rooms")) || [];


// save room records in the localstorage
function saveRooms() {
    localStorage.setItem(
        "rooms",
        JSON.stringify(rooms)
    );
}
// Store the room being edited
let editIndex = -1;

// display room statistics

function displayStatistics() {

    let total = 20;
    let available = 0;
    let booked = 0;
    let occupied = 0;

    // Check every room
     for (let i = 0; i < rooms.length; i++) {

        let status = rooms[i].status.toLowerCase();

        if (status === "booked") {
            booked++;
        }

        else if (status === "occupied") {
            occupied++;
        }
    }
 // Calculate available rooms
    available = total - booked - occupied;

    // Display statistics
    totalRooms.textContent = total;
    availableRooms.textContent = available;
    bookedRooms.textContent = booked;
    occupiedRooms.textContent = occupied;
}


// display the recorded rooms in a table
function displayRooms(roomRecords = rooms) {

    roomList.innerHTML = "";

    // Check if there are no rooms
    if (roomRecords.length === 0) {

        let row = document.createElement("tr");
        let cell = document.createElement("td");

        cell.colSpan = 5;
        cell.textContent = "No rooms found";

        row.appendChild(cell);
        roomList.appendChild(row);

        return;
    }
    }

    // Display each room
    for (let i = 0; i < roomRecords.length; i++) {

        let room = roomRecords[i];

        let row = document.createElement("tr");

        let numberCell = document.createElement("td");
        let typeCell = document.createElement("td");
        let priceCell = document.createElement("td");
        let statusCell = document.createElement("td");
        let actionCell = document.createElement("td");

        // Display room details
        numberCell.textContent = room.roomNumber;
        typeCell.textContent = room.roomType;

        priceCell.textContent = "KSh " +
            Number(room.price).toLocaleString("en-KE");

    
    // Create status label
     let statusLabel = document.createElement("span");

        statusLabel.textContent =
            room.status.charAt(0).toUpperCase() +
            room.status.slice(1);

        statusLabel.classList.add("status");
        statusLabel.classList.add(room.status);

        statusCell.appendChild(statusLabel);

        // create edit button
        
let editButton = document.createElement("button");
editButton.textContent = "Edit";

editButton.addEventListener("click", function() {
    editRoom(i);
});

//  Create Delete button
let deleteButton = document.createElement("button");
deleteButton.textContent = "Delete";

deleteButton.addEventListener("click", function() {
    deleteRoom(i);
});

//  create buttons to actioncell
actionCell.appendChild(editButton);
actionCell.appendChild(deleteButton);

    // Add cells to the row
     row.append(
            numberCell,
            typeCell,
            priceCell,
            statusCell,
            actionCell
        );

    // Add row to the table
    roomList.appendChild(row);
    }
    
// Edit room function
function editRoom(index) {

    // Get the selected room
    let room = rooms[index];

    // Put room details into the form
    roomNumber.value = room.roomNumber;
    roomType.value = room.roomType;
    roomPrice.value = room.price;
    roomStatus.value = room.status;

    // Store the index of the room being edited
    editIndex = index;

    // Change button text
    roomForm.querySelector("button[type='submit']").textContent = "Update Room";
}

//  add new room button using eventlistener 
roomForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get information from the form
     let number = roomNumber.value.trim();
    let type = roomType.value;
    let price = Number(roomPrice.value);
    let status = roomStatus.value;

    // Check if the room number already exists
   let exists = rooms.some(function(room) {
        return room.roomNumber.toLowerCase() === number.toLowerCase();
    });

    if (exists) {
        alert("Room number already exists!");
        return;
    }

    // Create a new room object
    let room = {
        roomNumber: number,
        roomType: type,
        price: price,
        status: status
    };


    // Add room to the list
    rooms.push(room);

    // Save and display rooms
    saveRooms();
    displayRooms();
    displayStatistics();

    // Clear the form
    roomForm.reset();

    alert("Room added successfully!");

});

roomSearch.addEventListener("input", function() {

    let searchValue = roomSearch.value.toLowerCase();

    let matchingRooms = rooms.filter(function(room) {

        return room.roomNumber.toLowerCase().includes(searchValue) ||
               room.roomType.toLowerCase().includes(searchValue);

    });

    displayRooms(matchingRooms);
});


// 8. Display saved rooms when the page opens
displayRooms();
displayStatistics();

