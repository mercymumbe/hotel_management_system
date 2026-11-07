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

    // Display total rooms
    totalRoomsElement.textContent = rooms.length;

    // Find rooms whose status is Available
    const available = rooms.filter(room =>
        String(room.status || "").toLowerCase() === "available"
    );

    // Display available rooms
    availableRoomsElement.textContent = available.length;

    // Display total bookings
    totalBookingsElement.textContent = bookings.length;

    // Display total customers
    totalCustomersElement.textContent = customers.length;
}