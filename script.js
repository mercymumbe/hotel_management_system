// Get rooms from localStorage
let rooms = JSON.parse(localStorage.getItem("rooms")) || [];

// Get customers from localStorage
let customers = JSON.parse(localStorage.getItem("customers")) || [];

// Get bookings from localStorage
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

// Get the statistics elements from HTML
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