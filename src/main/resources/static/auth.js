// Authentication JavaScript

// Check if user is already logged in on page load
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop()

  // If user is logged in and on login/signup page, redirect to home
  if ((currentPage === "login.html" || currentPage === "signup.html") && isLoggedIn()) {
    window.location.href = "index.html"
    return
  }

  // Setup form handlers
  const loginForm = document.getElementById("loginForm")
  const signupForm = document.getElementById("signupForm")

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup)
  }
})

// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem("currentUser") !== null
}

// Get current user data
function getCurrentUser() {
  const userJson = localStorage.getItem("currentUser")
  return userJson ? JSON.parse(userJson) : null
}

// Handle Login - UPDATED TO USE BACKEND API
async function handleLogin(e) {
  e.preventDefault()

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  try {
    // Send login request to backend
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })

    if (!response.ok) {
      showError("Invalid email or password")
      return
    }

    const userData = await response.json()

    // Save user data locally for session
    localStorage.setItem("currentUser", JSON.stringify(userData))

    showSuccess("Login successful! Redirecting...")

    setTimeout(() => {
      window.location.href = "index.html"
    }, 1000)

  } catch (error) {
    console.error("Login error:", error)
    showError("Network error. Please check if backend is running on port 8080.")
  }
}

// Handle Signup - UPDATED TO USE BACKEND API
async function handleSignup(e) {
  e.preventDefault()

  const firstName = document.getElementById("firstName").value
  const lastName = document.getElementById("lastName").value
  const email = document.getElementById("signupEmail").value
  const phone = document.getElementById("phone").value
  const password = document.getElementById("signupPassword").value
  const confirmPassword = document.getElementById("confirmPassword").value

  // Validation
  if (password !== confirmPassword) {
    showError("Passwords do not match")
    return
  }

  if (password.length < 8) {
    showError("Password must be at least 8 characters")
    return
  }

  try {
    // Send signup request to backend
    const response = await fetch("http://localhost:8080/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        password: password
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      showError(errorText || "Signup failed. Email may already exist.")
      return
    }

    const userData = await response.json()

    // Save user data locally for session
    localStorage.setItem("currentUser", JSON.stringify(userData))

    showSuccess("Account created! Redirecting...")

    setTimeout(() => {
      window.location.href = "index.html"
    }, 1000)

  } catch (error) {
    console.error("Signup error:", error)
    showError("Network error. Please check if backend is running on port 8080.")
  }
}

// Logout function
function logout() {
  // Clear all stored user data
  localStorage.removeItem("currentUser")
  localStorage.removeItem("user")
  localStorage.removeItem("token")
  sessionStorage.clear()
  
  // Show logout message
  alert("You have been logged out successfully")
  
  // Redirect to home page or login page
  window.location.href = "/"
}

// Show error message
function showError(message) {
  // Remove any existing messages
  const existingError = document.querySelector(".error-message")
  if (existingError) {
    existingError.remove()
  }

  // Create error element
  const errorDiv = document.createElement("div")
  errorDiv.className = "error-message show"
  errorDiv.textContent = message

  // Insert before form
  const form = document.querySelector(".auth-form")
  if (form && form.parentNode) {
    form.parentNode.insertBefore(errorDiv, form)
  }

  // Auto remove after 5 seconds
  setTimeout(() => {
    errorDiv.classList.remove("show")
    setTimeout(() => errorDiv.remove(), 300)
  }, 5000)
}

// Show success message
function showSuccess(message) {
  // Remove any existing messages
  const existingSuccess = document.querySelector(".success-message")
  if (existingSuccess) {
    existingSuccess.remove()
  }

  // Create success element
  const successDiv = document.createElement("div")
  successDiv.className = "success-message show"
  successDiv.textContent = message

  // Insert before form
  const form = document.querySelector(".auth-form")
  if (form && form.parentNode) {
    form.parentNode.insertBefore(successDiv, form)
  }
}

console.log("[v0] Auth system loaded with backend integration")
