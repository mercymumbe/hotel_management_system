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


