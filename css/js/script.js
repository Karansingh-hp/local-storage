
"use strict";

// LocalStorage keys
const USER_KEY = "novaSpaceUser";
const LOGIN_KEY = "novaSpaceLoggedIn";
const EMAIL_KEY = "novaSpaceCurrentEmail";

// Helper: display messages
function showMessage(elementId, message, type) {
  const element = document.getElementById(elementId);

  if (!element) return;

  element.textContent = message;
  element.className = "message " + type;
}

// Get registered user
function getRegisteredUser() {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
}

// Check whether the current session belongs to the stored user
function isLoggedIn() {
  const user = getRegisteredUser();

  return (
    localStorage.getItem(LOGIN_KEY) === "true" &&
    user !== null &&
    localStorage.getItem(EMAIL_KEY) === user.email
  );
}

// Q1: Registration
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("fullName")
      .value.trim();

    const email = document.getElementById("registerEmail")
      .value.trim().toLowerCase();

    const password = document.getElementById("registerPassword")
      .value;

    const confirmPassword = document.getElementById("confirmPassword")
      .value;

    // Validate required fields
    if (!name || !email || !password || !confirmPassword) {
      showMessage(
        "registerMessage",
        "Please fill in all fields.",
        "error"
      );
      return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      showMessage(
        "registerMessage",
        "Please enter a valid email address.",
        "error"
      );
      return;
    }

    // Validate password length
    if (password.length < 6) {
      showMessage(
        "registerMessage",
        "Password must be at least 6 characters.",
        "error"
      );
      return;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      showMessage(
        "registerMessage",
        "Passwords do not match.",
        "error"
      );
      return;
    }

    // Prevent overwriting an existing account
    const existingUser = getRegisteredUser();

    if (existingUser && existingUser.email === email) {
      showMessage(
        "registerMessage",
        "This email is already registered. Please login.",
        "error"
      );
      return;
    }

    // Save registered user
    const user = {
      name: name,
      email: email,
      password: password
    };

    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      // Registration should not automatically log in the user
      localStorage.removeItem(LOGIN_KEY);
      localStorage.removeItem(EMAIL_KEY);

      showMessage(
        "registerMessage",
        "Registration successful! Redirecting to login...",
        "success"
      );

      registerForm.reset();

      // Redirect after displaying the success message
      setTimeout(function () {
        window.location.href = "index.html";
      }, 1200);

    } catch (error) {
      showMessage(
        "registerMessage",
        "Unable to save your account in LocalStorage.",
        "error"
      );
    }
  });
}

// Q2: Login
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  // If already logged in, open the homepage
  if (isLoggedIn()) {
    window.location.replace("home.html");
  }

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail")
      .value.trim().toLowerCase();

    const password = document.getElementById("loginPassword")
      .value;

    if (!email || !password) {
      showMessage(
        "loginMessage",
        "Please enter your email and password.",
        "error"
      );
      return;
    }

    const user = getRegisteredUser();

    // Check credentials
    if (
      user &&
      user.email === email &&
      user.password === password
    ) {
      try {
        localStorage.setItem(LOGIN_KEY, "true");
        localStorage.setItem(EMAIL_KEY, user.email);

        showMessage(
          "loginMessage",
          "Login successful! Opening your homepage...",
          "success"
        );

        window.location.replace("home.html");

      } catch (error) {
        localStorage.removeItem(LOGIN_KEY);
        localStorage.removeItem(EMAIL_KEY);

        showMessage(
          "loginMessage",
          "Unable to save your login status.",
          "error"
        );
      }

    } else {
      showMessage(
        "loginMessage",
        "Incorrect email or password.",
        "error"
      );
    }
  });
}

// Q3 and Q4: Protect homepage and display user details
const userNameElement = document.getElementById("userName");

if (userNameElement) {
  if (!isLoggedIn()) {
    window.location.replace("index.html");
  } else {
    const user = getRegisteredUser();

    document.getElementById("userName").textContent = user.name;
    document.getElementById("profileName").textContent = user.name;
    document.getElementById("profileEmail").textContent = user.email;
  }
}

// Q4: Logout
const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
  logoutButton.addEventListener("click", function () {
    // Remove session status
    localStorage.removeItem(LOGIN_KEY);
    localStorage.removeItem(EMAIL_KEY);

    // Keep the registered account for the next login
    window.location.replace("index.html");
  });
}
