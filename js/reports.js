
// ==========================================
// BLUE PEARL HOTEL MANAGEMENT SYSTEM
// REPORTS PAGE JAVASCRIPT
// ==========================================


// 1. GET HTML ELEMENTS

let totalRevenue = document.getElementById("totalRevenue");
let totalBookings = document.getElementById("totalBookings");
let occupancyRate = document.getElementById("occupancyRate");
let totalCustomers = document.getElementById("totalCustomers");

let reportPeriod = document.getElementById("reportPeriod");
let exportReport = document.getElementById("exportReport");
let reportList = document.getElementById("reportList");


// 2. GET DATA FROM LOCAL STORAGE

let rooms = JSON.parse(localStorage.getItem("rooms")) || [];
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
let customers = JSON.parse(localStorage.getItem("customers")) || [];
let payments = JSON.parse(localStorage.getItem("payments")) || [];


// 3. CHART VARIABLES

let revenueChart = null;
let bookingChart = null;
let occupancyChart = null;
let roomRevenueChart = null;


// 4. HELPER FUNCTIONS

// Get a value from an object using possible property names
function getValue(object, properties) {

    for (let property of properties) {

        if (object[property] !== undefined && object[property] !== null) {
            return object[property];
        }

    }

    return "";

}


// Format currency
function formatCurrency(amount) {

    return "KSh " + Number(amount || 0).toLocaleString("en-KE");

}


// Convert dates into JavaScript date objects
function parseDate(value) {

    if (!value) return null;

    let match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (match) {

        return new Date(
            Number(match[1]),
            Number(match[2]) - 1,
            Number(match[3])
        );

    }

    let date = new Date(value);

    return isNaN(date.getTime()) ? null : date;

}


// Get selected report period
function getDateRange() {

    let days = Number(reportPeriod.value);

    let endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - days + 1);

    return {
        startDate,
        endDate
    };

}


// Check whether a record falls within the selected period
function isWithinPeriod(dateValue) {

    let date = parseDate(dateValue);

    if (!date) return false;

    let range = getDateRange();

    return date >= range.startDate && date <= range.endDate;

}


// Get booking date
function getBookingDate(booking) {

    return getValue(booking, [
        "bookingDate",
        "checkInDate",
        "checkIn",
        "date"
    ]);

}


// Get room ID
function getRoomId(booking) {

    return getValue(booking, [
        "roomId",
        "roomID"
    ]);

}


// 5. FILTER PAYMENTS

function getFilteredPayments() {

    return payments.filter(payment => {

        let status = String(payment.status).toLowerCase();

        return status === "completed" &&
            isWithinPeriod(payment.date);

    });

}


// 6. FILTER BOOKINGS

function getFilteredBookings() {

    return bookings.filter(booking => {

        return isWithinPeriod(getBookingDate(booking));

    });

}


// 7. CALCULATE TOTAL REVENUE

function calculateRevenue() {

    let filteredPayments = getFilteredPayments();

    let revenue = filteredPayments.reduce((total, payment) => {

        return total + Number(payment.amount || 0);

    }, 0);

    totalRevenue.textContent = formatCurrency(revenue);

    return revenue;

}


// 8. CALCULATE TOTAL BOOKINGS

function calculateBookings() {

    let filteredBookings = getFilteredBookings();

    totalBookings.textContent = filteredBookings.length;

    return filteredBookings;

}


// 9. CALCULATE ROOM OCCUPANCY

function calculateOccupancy() {

    let totalRooms = rooms.length;

    let occupiedRooms = rooms.filter(room => {

        let status = String(
            getValue(room, ["status", "availability"])
        ).toLowerCase();

        return status === "occupied";

    }).length;


    let availableRooms = rooms.filter(room => {

        let status = String(
            getValue(room, ["status", "availability"])
        ).toLowerCase();

        return status === "available";

    }).length;


    let maintenanceRooms = rooms.filter(room => {

        let status = String(
            getValue(room, ["status", "availability"])
        ).toLowerCase();

        return status === "maintenance";

    }).length;


    let rate = totalRooms > 0
        ? (occupiedRooms / totalRooms) * 100
        : 0;


    occupancyRate.textContent = rate.toFixed(1) + "%";


    return {
        totalRooms,
        occupiedRooms,
        availableRooms,
        maintenanceRooms,
        rate
    };

}


// 10. CALCULATE TOTAL CUSTOMERS

function calculateCustomers() {

    let customerCount = customers.length;

    totalCustomers.textContent = customerCount;

    return customerCount;

}


// ==========================================
// 11. REVENUE OVERVIEW CHART
// ==========================================

function createRevenueChart() {

    let filteredPayments = getFilteredPayments();

    let days = Number(reportPeriod.value);

    let revenueData = {};


    filteredPayments.forEach(payment => {

        let date = parseDate(payment.date);

        if (!date) return;

        let key;

        if (days <= 30) {

            key = date.toLocaleDateString("en-CA");

        } else if (days <= 90) {

            let weekDate = new Date(date);

            weekDate.setDate(
                weekDate.getDate() - weekDate.getDay()
            );

            key = weekDate.toLocaleDateString("en-CA");

        } else {

            key = date.getFullYear() + "-" +
                String(date.getMonth() + 1).padStart(2, "0");

        }


        revenueData[key] =
            (revenueData[key] || 0) + Number(payment.amount || 0);

    });


    let labels = Object.keys(revenueData).sort();

    let values = labels.map(key => revenueData[key]);


    if (revenueChart) {
        revenueChart.destroy();
    }


    revenueChart = new Chart(
        document.getElementById("revenueChart"),
        {

            type: "line",

            data: {

                labels: labels,

                datasets: [{

                    label: "Revenue (KSh)",

                    data: values,

                    borderColor: "#17365d",

                    backgroundColor: "rgba(23, 54, 93, 0.12)",

                    borderWidth: 3,

                    fill: true,

                    tension: 0.4,

                    pointRadius: 4

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: true
                    }

                },

                scales: {

                    y: {
                        beginAtZero: true
                    }

                }

            }

        }

    );

}


// ==========================================
// 12. BOOKING STATUS CHART
// ==========================================

function createBookingChart() {

    let filteredBookings = getFilteredBookings();

    let confirmed = 0;
    let pending = 0;
    let cancelled = 0;


    filteredBookings.forEach(booking => {

        let status = String(booking.status).toLowerCase();

        if (status === "confirmed") {

            confirmed++;

        } else if (status === "pending") {

            pending++;

        } else if (status === "cancelled") {

            cancelled++;

        }

    });


    if (bookingChart) {
        bookingChart.destroy();
    }


    bookingChart = new Chart(
        document.getElementById("bookingChart"),
        {

            type: "doughnut",

            data: {

                labels: [
                    "Confirmed",
                    "Pending",
                    "Cancelled"
                ],

                datasets: [{

                    data: [
                        confirmed,
                        pending,
                        cancelled
                    ],

                    backgroundColor: [
                        "rgb(4,4,87)",
                        "rgb(253, 196, 9)",
                        "rgb(248, 222, 51)"
                    ],

                    borderWidth: 2

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        position: "bottom"
                    }

                }

            }

        }

    );

}


// occupancy chart section
function createOccupancyChart() {

    let roomData = calculateOccupancy();


    if (occupancyChart) {
        occupancyChart.destroy();
    }


    occupancyChart = new Chart(
        document.getElementById("occupancyChart"),
        {

            type: "doughnut",

            data: {

                labels: [
                    "Occupied",
                    "Available",
                    "Maintenance"
                ],

                datasets: [{

                    data: [
                        roomData.occupiedRooms,
                        roomData.availableRooms,
                        roomData.maintenanceRooms
                    ],

                    backgroundColor: [
                        "#17365d",
                        "#2a9d8f",
                        "#f4b942"
                    ],

                    borderWidth: 2

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        position: "bottom"
                    }

                }

            }

        }

    );

}


// display revenue chart section
function createRoomRevenueChart() {

    let filteredPayments = getFilteredPayments();

    let revenueByRoom = {};


    filteredPayments.forEach(payment => {

        // Find the booking connected to the payment
        let booking = bookings.find(item => {

            return String(item.bookingId) ===
                String(payment.bookingId);

        });


        if (!booking) return;


        // Get room ID from booking
        let roomId = getRoomId(booking);


        // Find the room
        let room = rooms.find(item => {

            let id = getValue(item, ["roomId", "id"]);

            return String(id) === String(roomId);

        });


        // Get room category
        let roomType = getValue(booking, [
            "roomType",
            "roomCategory"
        ]) || (room ? getValue(room, [
            "roomType",
            "type",
            "category"
        ]) : "") || "Other";


        revenueByRoom[roomType] =
            (revenueByRoom[roomType] || 0) +
            Number(payment.amount || 0);

    });


    let labels = Object.keys(revenueByRoom);

    let values = labels.map(type => revenueByRoom[type]);


    if (roomRevenueChart) {
        roomRevenueChart.destroy();
    }


    roomRevenueChart = new Chart(
        document.getElementById("roomRevenueChart"),
        {

            type: "bar",

            data: {

                labels: labels,

                datasets: [{

                    label: "Revenue (KSh)",

                    data: values,

                    backgroundColor: "#17365d",

                    borderRadius: 6

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                },

                scales: {

                    y: {
                        beginAtZero: true
                    }

                }

            }

        }

    );

}

// display report section
function displayReports() {

    let reports = [

        {
            id: "RPT001",
            name: "Revenue Report"
        },

        {
            id: "RPT002",
            name: "Booking Summary"
        },

        {
            id: "RPT003",
            name: "Customer Report"
        },

        {
            id: "RPT004",
            name: "Room Occupancy Report"
        }

    ];


    reportList.innerHTML = "";


    reports.forEach(report => {

        let row = document.createElement("tr");

        row.innerHTML = `

            <td>${report.id}</td>

            <td>${report.name}</td>

            <td>${new Date().toLocaleDateString("en-GB")}</td>

            <td>
                <span class="status completed">
                    Completed
                </span>
            </td>

            <td>
                <button class="view-btn" data-report="${report.id}">
                    View
                </button>

                <button class="download-btn" data-report="${report.id}">
                    Download
                </button>
            </td>

        `;


        reportList.appendChild(row);

    });

}

// export function
function exportToCSV() {

    let revenue = calculateRevenue();

    let filteredBookings = getFilteredBookings();

    let roomData = calculateOccupancy();

    let customerCount = calculateCustomers();


    let csvData = [

        ["BLUE PEARL HOTEL - REPORT"],

        ["Generated Date", new Date().toLocaleString()],

        ["Selected Period", reportPeriod.options[
            reportPeriod.selectedIndex
        ].text],

        [],

        ["Report Statistics", "Value"],

        ["Total Revenue", revenue],

        ["Total Bookings", filteredBookings.length],

        ["Occupancy Rate", roomData.rate.toFixed(1) + "%"],

        ["Total Customers", customerCount],

        [],

        [
            "Payment ID",
            "Booking ID",
            "Customer ID",
            "Amount",
            "Method",
            "Date",
            "Status"
        ]

    ];


    getFilteredPayments().forEach(payment => {

        csvData.push([

            payment.paymentId,

            payment.bookingId,

            payment.customerId,

            payment.amount,

            payment.method,

            payment.date,

            payment.status

        ]);

    });


    let csvContent = csvData.map(row => {

        return row.map(value => {

            let text = String(value ?? "");

            return '"' + text.replace(/"/g, '""') + '"';

        }).join(",");

    }).join("\n");


    let blob = new Blob(

        ["\uFEFF" + csvContent],

        { type: "text/csv;charset=utf-8;" }

    );


    let url = URL.createObjectURL(blob);

    let link = document.createElement("a");

    link.href = url;

    link.download = "Blue_Pearl_Hotel_Report.csv";

    link.click();

    URL.revokeObjectURL(url);

}

//  update all reports
function updateReports() {

    calculateRevenue();

    calculateBookings();

    calculateOccupancy();

    calculateCustomers();

    createRevenueChart();

    createBookingChart();

    createOccupancyChart();

    createRoomRevenueChart();

}


reportPeriod.addEventListener("change", function () {

    updateReports();

});

// export button
exportReport.addEventListener("click", function () {

    exportToCSV();

});


updateReports();

displayReports();
