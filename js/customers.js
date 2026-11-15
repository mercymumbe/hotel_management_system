
// get html elements for form section in customers page
let customerForm = document.getElementById("customerForm");

let customerName = document.getElementById("customerName");
let customerPhone = document.getElementById("customerPhone");
let customerEmail = document.getElementById("customerEmail");

// Get table and statistics elements
let customerList = document.getElementById("customerList");
let totalCustomers = document.getElementById("totalCustomers");

// Get customers from localStorage
let customers = JSON.parse(localStorage.getItem("customers")) || [];

// Store the ID of the customer being edited
let editingCustomerId = null;


// display function
function displayCustomers() {

    // Clear the table first
    customerList.innerHTML = "";

    // Go through each customer
    customers.forEach(function (customer) {

        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.phone}</td>
            <td>${customer.email}</td>
            <td>
            <button type="button" class="edit-btn">Edit</button>
            <button type="button" class="delete-btn">Delete</button>
            </td>
        `;

        // Edit customer function
        row.querySelector(".edit-btn").addEventListener("click", function() {

            editCustomer(customer.id);

        });

        // Delete customer
        row.querySelector(".delete-btn").addEventListener("click", function() {

            // Confirm before deleting
            let confirmDelete = confirm("Are you sure you want to delete this customer?");

            if (!confirmDelete) {
                return;
            }

            customers = customers.filter(function(item) {
                return item.id !== customer.id;
            });

            // Save the updated list
            localStorage.setItem("customers", JSON.stringify(customers));

            // Display updated customers
            displayCustomers();

        });

        customerList.appendChild(row);

    });

    // Update total customers
    totalCustomers.textContent = customers.length;
}


// Edit customer function
function editCustomer(customerId) {

    // Find the customer
    let customer = customers.find(function(item) {
        return item.id === customerId;
    });

    if (!customer) {
        return;
    }

    // Store the customer ID
    editingCustomerId = customerId;

    // Fill the form with customer details
    customerName.value = customer.name;
    customerPhone.value = customer.phone;
    customerEmail.value = customer.email;

    // Update form title and button
    document.getElementById("formTitle").textContent = "Update Customer";
    document.getElementById("saveCustomerBtn").textContent = "Update Customer";

}


// Customer form submission
customerForm.addEventListener("submit", function(event) {

    event.preventDefault();

    // Get customer details
    let name = customerName.value.trim();
    let phone = customerPhone.value.trim();
    let email = customerEmail.value.trim();

    // Validate customer details
    if (name === "" || phone === "" || email === "") {

        alert("Please fill in all customer details.");

        return;
    }


    if (editingCustomerId !== null) {

        // Update existing customer
        for (let customer of customers) {

            if (customer.id === editingCustomerId) {

                customer.name = name;
                customer.phone = phone;
                customer.email = email;

                break;
            }
        }

        editingCustomerId = null;

    } else {

        // Generate a unique customer ID
        let highestId = customers.reduce(function(max, customer) {

            let number = parseInt(customer.id.replace("C", "")) || 0;

            return Math.max(max, number);

        }, 0);

        // Create a customer object
        let customer = {

            id: "C" + String(highestId + 1).padStart(3, "0"),

            name: name,
            phone: phone,
            email: email

        };

        // Add customer to the array
        customers.push(customer);

    }


    // Save customers in localStorage
    localStorage.setItem("customers", JSON.stringify(customers));

    // Display customers in the table
    displayCustomers();

    // Clear the form
    customerForm.reset();

    // Restore original form title and button
    document.getElementById("formTitle").textContent = "Register Customer";

    document.getElementById("saveCustomerBtn").textContent = "Register Customer";

});


// Display saved customers
displayCustomers();
