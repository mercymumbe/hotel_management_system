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