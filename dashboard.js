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
// rooms statistics
displayStatistics();


// display customers
totalCustomers.textContent = customers.length;



// display for bookings
totalBookings.textContent = bookings.length;

recentBookingList.innerHTML = "";

// show new bokings
let recentBookings = bookings.slice(0).reverse();

for (let i = 0; i < recentBookings.length; i++) {

    let booking = recentBookings[i];

    // Create a table row
    let row = document.createElement("tr");

    // Add booking details
    row.innerHTML = `
        <td>${booking.id}</td>
        <td>${booking.customerName}</td>
        <td>${booking.roomNumber}</td>
        <td>${booking.checkIn}</td>
        <td>${booking.checkOut}</td>
        <td>${booking.status}</td>
    `;

    // Add row to the table
    recentBookingList.appendChild(row);

}
