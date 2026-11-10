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
            payment.bookingId === bookingId &&
            payment.status === "Completed"
        ) {
            paid += Number(payment.amount);
        }
    }

    return paid;
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
// booking function
function displayBookings() {

    bookingSelect.innerHTML =
        '<option value="">Choose booking</option>';

    for (let booking of bookings) {

        let paid = getAmountPaid(booking.bookingId);

        let balance = Number(booking.totalCost) - paid;

        if (balance > 0) {

            let option = document.createElement("option");

            option.value = booking.bookingId;

            option.textContent =
                booking.bookingId + " - " +
                getCustomerName(booking.customerId);

            bookingSelect.appendChild(option);
        }
    }
}
// display bookingdetails
function displayBookingDetails() {

    let selectedBooking = null;

    for (let booking of bookings) {

        if (booking.bookingId === bookingSelect.value) {

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


});
