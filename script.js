
// dashboard javascript

// Get rooms from localStorage
let rooms = JSON.parse(localStorage.getItem("rooms")) || [];

// Get customers from localStorage
let customers = JSON.parse(localStorage.getItem("customers")) || [];

// Get bookings from localStorage
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

// Get the statistics elements from  index.html
const totalRoomsElement = document.getElementById("totalRooms");
const availableRoomsElement = document.getElementById("availableRooms");
const totalBookingsElement = document.getElementById("totalBookings");
const totalCustomersElement = document.getElementById("totalCustomers");
const recentBookingListElement = document.getElementById("recentBookingList")

// Function to display statistics
function displayStatistics() {

    let totalRooms = rooms.length;
    let availableRooms = 0;

    // Count available rooms
    for (let i = 0; i < rooms.length; i++) {

        if (rooms[i].status === "Available") {
            availableRooms = availableRooms + 1;
        }
    }

    // Display the results
    document.getElementById("totalRooms").textContent = totalRooms;

    document.getElementById("availableRooms").textContent = availableRooms;

    document.getElementById("totalBookings").textContent = bookings.length;

    document.getElementById("totalCustomers").textContent = customers.length;

}

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

// save room records in the localstorage
function saveRooms() {
    localStorage.setItem(
        "rooms",
        JSON.stringify(rooms)
    );
}

// display room statistics

function displayStatistics() {

    let total = rooms.length;
    let available = 0;
    let booked = 0;
    let occupied = 0;

    // Check every room
    for (let i = 0; i < rooms.length; i++) {

        if (rooms[i].status === "available") {
            available++;
        }

        else if (rooms[i].status === "booked") {
            booked++;
        }

        else if (rooms[i].status === "occupied") {
            occupied++;
        }
    }
}

// Display the statistics
totalRooms.textContent = total;
availableRooms.textContent = available;
bookedRooms.textContent = booked;
occupiedRooms.textContent = occupied;

// display the recoded rooms in a tabe
function displayRooms(roomRecords = rooms) {
    roomList.innerHTML = "";

    // Check if there are no rooms
    if (roomRecords.length === 0) {

        let row = document.createElement("tr");
        let cell = document.createElement("td");

        cell.colSpan = 4;
        cell.textContent = "No rooms found";

        row.appendChild(cell);
        roomList.appendChild(row);

        return;
    }

    // Display each room
    for (let i = 0; i < roomRecords.length; i++) {

        let room = roomRecords[i];

        let row = document.createElement("tr");

        let numberCell = document.createElement("td");
        let typeCell = document.createElement("td");
        let priceCell = document.createElement("td");
        let statusCell = document.createElement("td");

        numberCell.textContent = room.roomNumber;
        typeCell.textContent = room.roomType;

        priceCell.textContent = "KSh " +
            Number(room.price).toLocaleString("en-KE");


    }
    // Create status label
    let statusLabel = document.createElement("span");

    statusLabel.textContent =
        room.status.charAt(0).toUpperCase() +
        room.status.slice(1);

    statusLabel.classList.add("status");
    statusLabel.classList.add(room.status);

    statusCell.appendChild(statusLabel);

    // Add cells to the row
    row.append(numberCell, typeCell, priceCell, statusCell);

    // Add row to the table
    roomList.appendChild(row);

}

//  add new room button using eventlistener 
roomForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get information from the form
    let number = roomNumber.value;
    let type = roomType.value;
    let price = roomPrice.value;
    let status = roomStatus.value;

    // Check if the room number already exists
    let exists = rooms.some(room => room.roomNumber === number);

    if (exists) {
        alert("Room number already exists!");
        return;
    }

    // Create a new room
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

    let matchingRooms = [];

    for (let i = 0; i < rooms.length; i++) {

        if (rooms[i].roomNumber.toLowerCase().includes(searchValue)) {

            matchingRooms.push(rooms[i]);

        }
    }

    displayRooms(matchingRooms);

});
  // Create a new room
    let newRoom = {
        roomNumber: newRoomNumber,
        roomType: newRoomType,
        price: newRoomPrice,
        status: newRoomStatus
    };

    // Add room to the rooms array
    rooms.push(newRoom);

    // Save rooms
    saveRooms();

    // Update the page
    displayRooms();
    displayStatistics();

    // Clear the form
    roomForm.reset();

    alert("Room added successfully!");


function loadRooms() {

    displayRooms();
    displayStatistics();

}

// Run the function
loadRooms();


// bookings page javascript
// get html elements for the booking page

// booking statistics section 
const totalBookings = document.getElementById("totalBookings");
const confirmedBookings = document.getElementById("confirmedBookings");
const pendingBookings = document.getElementById("pendingBookings");
const cancelledBookings = document.getElementById("cancelledBookings");

// room form selection section
const bookingForm = document.getElementById("bookingForm")

const customerSelect = document.getElementById("customerSelect");
const roomSelect = document.getElementById("roomSelect");

// checkin and checkouts dates
const checkIn = document.getElementById("checkIn");
const checkOut = document.getElementById("checkOut");

// booking status and the cost
const bookingStatus = document.getElementById("bookingStatus");
const totalCost = document.getElementById("totalCost");

// booking records
const bookingList = document.getElementById("bookingList");
const bookingSearch = document.getElementById("bookingSearch");

// save booking records in the local storage.
function saveBookings() {
    localStorage.setItem("bookings", JSON.stringify(bookings));
}

// display customers
function displayCustomers() {

    for (let i = 0; i < customers.length; i++) {

        let option = document.createElement("option");

        option.value = customers[i].customerId;
        option.textContent = customers[i].fullName;

        customerSelect.appendChild(option);
    }
}
// display for rooms

function displayRooms() {

    for (let i = 0; i < rooms.length; i++) {

        let option = document.createElement("option");

        option.value = rooms[i].roomNumber;

        option.textContent = rooms[i].roomNumber + " - " +
            rooms[i].roomType + " - KSh " + rooms[i].price;

        roomSelect.appendChild(option);
    }
}

// calculate number of nights

function calculateNights() {
     if (checkIn.value === "" || checkOut.value === "") {
        return 0;
    }
    let start = new Date(checkIn.value);
    let end = new Date(checkOut.value);

    let nights = (end - start) / (1000 * 60 * 60 * 24);

    return nights;
}
 
// calculate total cost
function calculateTotalCost() {

    let nights = calculateNights();
    let price = 0;

    // Get the selected room price
    for (let room of rooms) {
        if (room.roomNumber === roomSelect.value) {
            price = room.price;
        }
    }

    // Check if dates and room price are valid
    if (nights <= 0 || price <= 0) {
        totalCost.value = "";
    } else {
        totalCost.value = nights * price;
    }
}


// Calculate cost when room or dates change
roomSelect.addEventListener("change", calculateTotalCost);
checkIn.addEventListener("change", calculateTotalCost);
checkOut.addEventListener("change", calculateTotalCost);

// check available rooms
function checkRoomAvailability(roomNumber, startDate, endDate) {

    for (let booking of bookings) {

        if (booking.roomNumber === roomNumber &&
            booking.status !== "Cancelled") {

            if (startDate < booking.checkOut && endDate > booking.checkIn) {
                return false;
            }
        }
    }

    return true;
}

// booking ID
function generateBookingId() {

    let bookingNumber = bookings.length + 1;

    return "BK" + bookingNumber;
}

// display booking statistics

function displayStatistics() {

    let confirmed = 0;
    let pending = 0;
    let cancelled = 0;

    for (let i = 0; i < bookings.length; i++) {

        if (bookings[i].status === "Confirmed") {
            confirmed++;
        }

        if (bookings[i].status === "Pending") {
            pending++;
        }

        if (bookings[i].status === "Cancelled") {
            cancelled++;
        }
    }

    totalBookings.textContent = bookings.length;
    confirmedBookings.textContent = confirmed;
    pendingBookings.textContent = pending;
    cancelledBookings.textContent = cancelled;
}


