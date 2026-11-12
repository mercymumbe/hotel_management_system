
//  Get login form elements
let loginForm = document.getElementById("loginForm");
let username = document.getElementById("username");
let password = document.getElementById("password");
let errorMessage = document.getElementById("errorMessage");

//  Get registration form elements
let registerForm = document.getElementById("registerForm");
let fullName = document.getElementById("fullName");
let email = document.getElementById("email");
let registerUsername = document.getElementById("registerUsername");
let registerPassword = document.getElementById("registerPassword");
let confirmPassword = document.getElementById("confirmPassword");
let registerMessage = document.getElementById("registerMessage");

//  Get form sections
let loginSection = document.querySelector(".login-form");
let registerSection = document.getElementById("registerSection");

//  Get switching links
let showRegister = document.getElementById("showRegister");
let showLogin = document.getElementById("showLogin");

// get saved users from localStorage
let users = JSON.parse(localStorage.getItem("users")) || [];

//   save users to localStorage
function saveUsers() {
    localStorage.setItem("users", JSON.stringify(users));
}
// registration form section
showRegister.addEventListener("click", function (event) {

    event.preventDefault();

    loginSection.style.display = "none";
    registerSection.hidden = false;

});

// login form
showLogin.addEventListener("click", function (event) {

    event.preventDefault();

    registerSection.hidden = true;
    loginSection.style.display = "block";

});

// create an account section
registerForm.addEventListener("submit", function (event) {

    event.preventDefault();

    // Get registration details
    let name = fullName.value.trim();
    let userEmail = email.value.trim().toLowerCase();
    let newUsername = registerUsername.value.trim();
    let newPassword = registerPassword.value;
    let confirm = confirmPassword.value;

    // Check if passwords match
    if (newPassword !== confirm) {
        registerMessage.textContent = "Passwords do not match!";
        return;
    }

    // Check if account already exists
   let existingUser = users.find(function (user) {

        return user.username.toLowerCase() === newUsername.toLowerCase();
    });

    if (existingUser) {
        registerMessage.textContent = "Username already exists!";
        return;
    }

    // Create account
    let newUser = {
        name: name,
        email: userEmail,
        username: newUsername,
        password: newPassword
    };

    // Add user to array
    users.push(newUser);

    // Save user records
    saveUsers();

    // Clear registration form
    registerForm.reset();

    // Display success message
    alert("Account created successfully! Please login.");

    // Return to login form
    registerSection.hidden = true;
loginSection.style.display = "block";

    // Automatically fill username
    username.value = newUsername;

    // Clear registration message
    registerMessage.textContent = "";

});

// Login existing user
loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    // Get username and password
    let enteredUsername = username.value.trim();
    let enteredPassword = password.value;

    // Check if user exists
    let foundUser = false;

    for (let i = 0; i < users.length; i++) {

        if (users[i].username.toLowerCase() === enteredUsername.toLowerCase() &&
            users[i].password === enteredPassword) {

            foundUser = true;
            break;
        }
    }

    // Check login result
    if (foundUser) {
        alert("Login successful!");
        window.location.href = "dashboard.html";
    } else {
        alert("Incorrect username or password!");
    }

});