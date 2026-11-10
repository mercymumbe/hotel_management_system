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

