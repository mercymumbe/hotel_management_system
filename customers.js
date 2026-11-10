// customers page javascript


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
            <button class="delete-btn">Delete</button>
            </td>
        `;
        // Delete customer
        row.querySelector(".delete-btn").addEventListener("click", function() {

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

customerForm.addEventListener("submit", function(event) {

    event.preventDefault();

     // Get customer details
    let name = customerName.value.trim();
    let phone = customerPhone.value.trim();
    let email = customerEmail.value.trim();

   // Create a customer object
    let customer = {
        id: "C00" + (customers.length + 1),
        name: name,
        phone: phone,
        email: email
    };

    // Add customer to the array
    customers.push(customer);

    // Store the ID of the customer being edited
let editingCustomerId = null;

    // Save customers in localStorage
    localStorage.setItem("customers", JSON.stringify(customers));

    // Display customers in the table
    displayCustomers();

    // Clear the form
    customerForm.reset();

});
// Display saved customers 
displayCustomers();