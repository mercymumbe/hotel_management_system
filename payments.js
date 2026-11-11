// get html elements from payments page

// Payment statistics
const totalPayments = document.getElementById("totalPayments");
const completedPayments = document.getElementById("completedPayments");
const pendingPayments = document.getElementById("pendingPayments");
const totalAmount = document.getElementById("totalAmount");

// Payment form
const paymentForm = document.getElementById("paymentForm");

const bookingSelect = document.getElementById("bookingSelect");
const customerName = document.getElementById("customerName");
const bookingAmount = document.getElementById("bookingAmount");
const amountPaid = document.getElementById("amountPaid");
const paymentMethod = document.getElementById("paymentMethod");
const paymentStatus = document.getElementById("paymentStatus");

// Payment records
const paymentList = document.getElementById("paymentList");
const paymentSearch = document.getElementById("paymentSearch");

// saved records from localStorage

let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

let customers = JSON.parse(localStorage.getItem("customers")) || [];

let payments = JSON.parse(localStorage.getItem("payments")) || [];

//  Save payments
function savePayments() {

    localStorage.setItem("payments", JSON.stringify(payments));

}
// calculation function
function getAmountPaid(bookingId) {

    let paid = 0;

    for (let payment of payments) {

          if (
            String(payment.bookingId) === String(bookingId) &&
            payment.status === "Completed"
        ) {
            paid += Number(payment.amount) || 0;
        }
    }

    return paid;
}
// display bookings
function displayBookings() {

    bookingSelect.innerHTML = '<option value="">Choose booking</option>';

    for (let i = 0; i < bookings.length; i++) {

        let option = document.createElement("option");

        option.value = bookings[i].bookingId;

        // Display booking ID and customer name
        option.textContent = bookings[i].bookingId + " - " + bookings[i].customerId;

        bookingSelect.appendChild(option);
    }
}

// find customers name function.
function getCustomerName(customerId) {

    for (let customer of customers) {

        if (String(customer.id) === String(customerId)) {

            return customer.name;
        }
    }

    return "Unknown Customer";
}
        
// display bookingdetails
function displayBookingDetails() {

    let selectedBooking = null;

    for (let booking of bookings) {

        if (String(booking.bookingId) === String(bookingSelect.value)) {

            selectedBooking = booking;
            break;
        }
    }

    if (selectedBooking === null) {

        customerName.value = "";
        bookingAmount.value = "";
        amountPaid.max = "";

        return;
    }

    let paid = getAmountPaid(selectedBooking.bookingId);

    let balance = Number(selectedBooking.totalCost) - paid;

    customerName.value =
        getCustomerName(selectedBooking.customerId);

    bookingAmount.value = Number(selectedBooking.totalCost);

    // Limit the payment to the remaining balance
    amountPaid.max = balance;

    amountPaid.placeholder = "Maximum: KSh " +
        balance.toLocaleString("en-KE");
}

// Update booking details when selection changes
bookingSelect.addEventListener("change", displayBookingDetails);

//  payment ID
function generatePaymentId() {

    let highestNumber = 0;

    for (let payment of payments) {

        let number = parseInt(
            String(payment.paymentId).replace("PMT", ""),
            10
        );

        if (!isNaN(number) && number > highestNumber) {
            highestNumber = number;
        }
    }

    return "PMT" + String(highestNumber + 1).padStart(3, "0");
}
 
// payment statistics
function displayStatistics() {

    let completed = 0;
    let pending = 0;
    let received = 0;

    for (let payment of payments) {

        if (payment.status === "Completed") {

            completed++;
            received += Number(payment.amount);

        }

        else if (payment.status === "Pending") {

            pending++;

        }
    }

    totalPayments.textContent = payments.length;

    completedPayments.textContent = completed;

    pendingPayments.textContent = pending;

    totalAmount.textContent =
        "KSh " + received.toLocaleString("en-KE");
}

// payment record section
function displayPayments(records = payments) {

    paymentList.innerHTML = "";

    if (records.length === 0) {

        paymentList.innerHTML =
            "<tr><td colspan='8'>No payments found</td></tr>";

        return;
    }

    for (let payment of records) {

        let name = getCustomerName(payment.customerId);

        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${payment.paymentId}</td>
            <td>${payment.bookingId}</td>
            <td>${name}</td>
            <td>KSh ${Number(payment.amount).toLocaleString("en-KE")}</td>
            <td>${payment.method}</td>
            <td>${payment.date}</td>
            <td>
                <span class="status ${payment.status.toLowerCase()}">
                    ${payment.status}
                </span>
            </td>
            <td>
                <button class="delete-btn">Delete</button>
            </td>
        `;

        let deleteButton = row.querySelector("button");

        deleteButton.addEventListener("click", function() {

            deletePayment(payment.paymentId);

        });

        paymentList.appendChild(row);
    }
}

// Add a new payment

paymentForm.addEventListener("submit", function(event) {

    event.preventDefault();

    let bookingId = bookingSelect.value;
    let amount = Number(amountPaid.value);
    let method = paymentMethod.value;
    let status = paymentStatus.value;

    // Check if a booking is selected

    if (bookingId === "") {
        alert("Please select a booking.");
        return;
    }

    let selectedBooking = null;

    for (let booking of bookings) {

        if (String(booking.bookingId) === String(bookingId)) {

            selectedBooking = booking;
            break;
        }
    }

    if (selectedBooking === null) {

        alert("Booking not found.");
        return;
    }
    // Check the remaining balance

    let paid = getAmountPaid(bookingId);
    let balance = selectedBooking.totalCost - paid;

    if (amount <= 0) {
        alert("Enter a valid payment amount.");
        return;
    }

    if (amount > balance) {
        alert("Payment is greater than the remaining balance.");
        return;
    }
    let today = new Date().toISOString().split("T")[0];

    // Create payment

    let newPayment = {
        paymentId: generatePaymentId(),
        bookingId: bookingId,
        customerId: selectedBooking.customerId,
        amount: amount,
        method: method,
        date: today,
        status: status
    };
// Save payment

    payments.push(newPayment);

    savePayments();

    // Update the page

    displayPayments();
    displayStatistics();
    displayBookings();

    paymentForm.reset();

    customerName.value = "";
    bookingAmount.value = "";
    amountPaid.max = "";

    alert("Payment recorded successfully!");
    
});

// Search payments

paymentSearch.addEventListener("input", function() {

    let search = paymentSearch.value.toLowerCase();

    let results = payments.filter(function(payment) {

        let name = getCustomerName(payment.customerId);

        return payment.paymentId.toLowerCase().includes(search) ||
               payment.bookingId.toLowerCase().includes(search) ||
               name.toLowerCase().includes(search);
    });

    displayPayments(results);
});

// delete payment section

function deletePayment(paymentId) {

    let answer = confirm("Are you sure you want to delete this payment?");

    if (answer === false) {
        return;
    }

    payments = payments.filter(function(payment) {
        return payment.paymentId !== paymentId;
    });

    savePayments();

    displayPayments();
    displayStatistics();
    displayBookings();
}

// display saved records when the page opens

displayBookings();
displayPayments();
displayStatistics();