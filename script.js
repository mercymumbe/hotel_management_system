
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
const recentBookingListElement= document.getElementById("recentBookingList")

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
