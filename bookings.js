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

// Get bookings from localStorage
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

// get customers from the localstorage
let customers = JSON.parse(localStorage.getItem("customers")) || [];

// get rooms from localStorage
let rooms = JSON.parse(localStorage.getItem("rooms")) || [];


// save booking records in the local storage.
function saveBookings() {
    localStorage.setItem("bookings", JSON.stringify(bookings));
}

// display customers
function displayCustomers() {

    for (let i = 0; i < customers.length; i++) {

        let option = document.createElement("option");

        option.value = customers[i].id;
        option.textContent = customers[i].name;

        customerSelect.appendChild(option);
    }
}
// display for rooms

function displayRooms() {

    for (let i = 0; i < rooms.length; i++) {

        if (rooms[i].status === "Available") {

            let option = document.createElement("option");

            option.value = rooms[i].roomNumber;

            option.textContent = rooms[i].roomNumber + " - " +
                rooms[i].roomType + " - KSh " + rooms[i].price;

            roomSelect.appendChild(option);

        }

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
         if (String(room.roomNumber) === roomSelect.value) {
            price = Number(room.price);
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

        if (String(booking.roomNumber) === String(roomNumber) &&
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

    for (let booking of bookings) {

        if (booking.status === "Confirmed") {
            confirmed++;
        }

        if (booking.status === "Pending") {
            pending++;
        }

        if (booking.status === "Cancelled") {
            cancelled++;
        }

    }

    totalBookings.textContent = bookings.length;

    confirmedBookings.textContent = confirmed;

    pendingBookings.textContent = pending;

    cancelledBookings.textContent = cancelled;

}
// display booking records in a table
function displayBookings(records) {

    // Clear the table
    bookingList.innerHTML = "";

    // Check if there are no bookings
    if (records.length === 0) {
        bookingList.innerHTML = "<tr><td colspan='9'>No bookings found</td></tr>";
        return;
    }

    // Go through each booking
    for (let booking of records) {

        // Find customer name
        let customerName = "Unknown Customer";

        for (let customer of customers) {
            if (customer.id === booking.customerId) {
                customerName = customer.name;
            }
        }

        // Create a new table row
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${booking.bookingId}</td>
            <td>${customerName}</td>
            <td>${booking.roomNumber}</td>
            <td>${booking.checkIn}</td>
            <td>${booking.checkOut}</td>
            <td>${booking.nights}</td>
            <td>KSh ${Number(booking.totalCost).toLocaleString("en-KE")}</td>
            <td><span class="status ${booking.status.toLowerCase()}">${booking.status}</span></td>
            <td><button class="delete-btn">Delete</button></td>
        `;

        // Get the delete button
        let deleteButton = row.querySelector("button");

        // Delete booking when clicked
        deleteButton.addEventListener("click", function () {
            deleteBooking(booking.bookingId);
        });
        bookingList.appendChild(row);
    }
}

// save the booking
bookingForm.addEventListener("submit", function(event) {

    event.preventDefault();

    // Get values from the form
    let customerId = customerSelect.value;
    let roomNumber = roomSelect.value;
    let startDate = checkIn.value;
    let endDate = checkOut.value;
    let status = bookingStatus.value;

    let nights = calculateNights();

    // Check if customer and room are selected
     if (customerId === "" || roomNumber === "") {
        alert("Please select a customer and a room.");
        return;
    }

    // Check the dates
     if (nights <= 0) {
        alert("Check-out must be after check-in.");
        return;
    }

    // Check if the room is already booked
    if (!checkRoomAvailability(roomNumber, startDate, endDate)) {
        alert("This room is already booked for these dates.");
        return;
    }


    // Get the room price
    let price = 0;

    for (let room of rooms) {

        if (String(room.roomNumber) === roomNumber) {
            price = Number(room.price);
        }
    }

    // Calculate total cost
    let cost = nights * price;

    // Create a new booking
     let newBooking = {
        bookingId: generateBookingId(),
        customerId: customerId,
        roomNumber: roomNumber,
        checkIn: startDate,
        checkOut: endDate,
        nights: nights,
        totalCost: cost,
        status: status
    };

    // Add booking to the array
    bookings.push(newBooking);

    // Save booking
    saveBookings();

    // Update the page
    displayBookings(bookings);
    displayStatistics();

    // Clear the form
    bookingForm.reset();
    totalCost.value = "";

    alert("Booking saved successfully!");
});

// deleting booking records
function deleteBooking(bookingId) {

    let answer = confirm("Are you sure you want to delete this booking?");

    if (!answer) return;

    bookings = bookings.filter(function (booking) {
        return booking.bookingId !== bookingId;
    });

    saveBookings();

    displayBookings(bookings);
    displayStatistics();
}
