// Get the login form
let loginForm = document.getElementById("loginForm");

// Get the registration form
let registerForm = document.getElementById("registerForm");

// Get login and registration sections
let loginSection = document.querySelector(".login-form");
let registerSection = document.getElementById("registerFormSection");

// Get the links
let showRegister = document.getElementById("showRegister");
let showLogin = document.getElementById("showLogin");

// registration form section
showRegister.addEventListener("click", function(event) {

    event.preventDefault();

    loginSection.style.display = "none";
    registerSection.hidden = false;

});

// login form
showLogin.addEventListener("click", function(event) {

    event.preventDefault();

    registerSection.hidden = true;
    loginSection.style.display = "block";

});

// create an account section
registerForm.addEventListener("submit", function(event) {

    event.preventDefault();
// Get registration details
    let name = document.getElementById("fullName").value.trim();
    let email = document.getElementById("registerEmail").value.trim();
    let password = document.getElementById("registerPassword").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    // Check if passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Check if account already exists
    let savedUser = localStorage.getItem("admin");

    if (savedUser !== null) {
        let user = JSON.parse(savedUser);

        if (user.email === email) {
            alert("This email already has an account!");
            return;
        }
    }
     // Create account
    let admin = {
        name: name,
        email: email,
        password: password
    };
     // Save account in browser
    localStorage.setItem("admin", JSON.stringify(admin));
    
    // Clear registration form
    registerForm.reset();

    // Return to login form
    registerSection.hidden = true;
    loginSection.style.display = "block";


})

