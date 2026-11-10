// Get the dashboard elements
let totalRooms = document.getElementById("totalRooms");
let availableRooms = document.getElementById("availableRooms");
let totalBookings = document.getElementById("totalBookings");
let totalCustomers = document.getElementById("totalCustomers");
let recentBookingList = document.getElementById("recentBookingList");

// get saved rooms records from localstorage
let rooms = JSON.parse(localStorage.getItem("rooms")) || [];

// get saved customers records from localstorage
let customers = JSON.parse(localStorage.getItem("customers")) || [];

// get saved bookings records from localStorage
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

// display for  rooms
totalRooms.textContent = rooms.length;

let available = 0;

for (let i = 0; i < rooms.length; i++) {

    if (rooms[i].status === "Available") {
        available++;
    }

}

availableRooms.textContent = available;


// display for bookings
totalBookings.textContent = bookings.length;

recentBookingList.innerHTML = "";



