// Booking form state
let currentStep = 1
let currentUser = null
const bookingData = {
  location: {},
  vehicle: {},
  schedule: {},
  addons: [],
  pointsUsed: 0,
  basePrice: 0,
}


// API Base URL
const API_BASE_URL = "http://localhost:8080/api"


// Function to initialize points - FIXED WITH NULL CHECK
function initializePoints() {
  // ⚠️ ADD THIS NULL CHECK - CRITICAL FIX
  if (!currentUser) {
    console.warn("No user logged in, skipping points initialization")
    return
  }
  
  const availablePoints = currentUser.points || 0
  const pointsInput = document.getElementById("pointsToUse")
  if (pointsInput) {
    pointsInput.max = availablePoints
    pointsInput.placeholder = `Max: ${availablePoints} points`


    // Display available points
    const availablePointsDisplay = document.querySelector(".available-points")
    if (availablePointsDisplay) {
      availablePointsDisplay.textContent = `You have ${availablePoints.toLocaleString()} points available`
    }
  }


  console.log("[v0] Points initialized for user:", currentUser.firstName, "Points:", availablePoints)
}


// Initialize booking form
document.addEventListener("DOMContentLoaded", () => {
  currentUser = getCurrentUser()
  if (!currentUser) {
    window.location.href = "login.html"
    return
  }


  initializePoints()
  setMinDate()


  // Form submission
  const bookingForm = document.getElementById("bookingForm")
  if (bookingForm) {
    bookingForm.addEventListener("submit", handleBookingSubmit)
  }


  // Points input listener
  const pointsInput = document.getElementById("pointsToUse")
  if (pointsInput) {
    pointsInput.addEventListener("input", updatePricing)
  }


  // Duration select listener
  const durationSelect = document.getElementById("duration")
  if (durationSelect) {
    durationSelect.addEventListener("change", updateBasePrice)
  }


  console.log("[v0] Booking system initialized")
})


// Set minimum date to today
function setMinDate() {
  const dateInput = document.getElementById("pickupDate")
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0]
    dateInput.min = today
    dateInput.value = today
  }
}


// Navigation between steps
function nextStep(step) {
  if (validateCurrentStep()) {
    saveCurrentStepData()
    goToStep(step)
  }
}


function prevStep(step) {
  goToStep(step)
}


function goToStep(step) {
  // Hide all sections
  document.querySelectorAll(".form-section").forEach((section) => {
    section.classList.remove("active")
  })


  // Show target section
  const targetSection = document.querySelector(`[data-step="${step}"]`)
  if (targetSection) {
    targetSection.classList.add("active")
  }


  // Update progress bar
  document.querySelectorAll(".progress-step").forEach((progressStep) => {
    const stepNum = Number.parseInt(progressStep.dataset.step)
    progressStep.classList.remove("active", "completed")
    if (stepNum === step) {
      progressStep.classList.add("active")
    } else if (stepNum < step) {
      progressStep.classList.add("completed")
    }
  })


  currentStep = step


  // If on review step, populate summary
  if (step === 5) {
    populateBookingSummary()
  }


  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" })
}


// Validate current step
function validateCurrentStep() {
  const currentSection = document.querySelector(`[data-step="${currentStep}"]`)
  const inputs = currentSection.querySelectorAll("input[required], select[required]")


  for (const input of inputs) {
    if (!input.value) {
      input.focus()
      alert(`Please fill in all required fields`)
      return false
    }
  }


  return true
}


// Save current step data
function saveCurrentStepData() {
  switch (currentStep) {
    case 1:
      bookingData.location = {
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        zipcode: document.getElementById("zipcode").value,
        area: document.getElementById("area").value,
      }
      break


    case 2:
      bookingData.vehicle = {
        make: document.getElementById("carMake").value,
        model: document.getElementById("carModel").value,
        year: document.getElementById("carYear").value,
        color: document.getElementById("carColor").value,
        licensePlate: document.getElementById("licensePlate").value,
      }
      break


    case 3:
      bookingData.schedule = {
        date: document.getElementById("pickupDate").value,
        time: document.getElementById("pickupTime").value,
        duration: document.getElementById("duration").value,
      }
      updateBasePrice()
      break


    case 4:
      bookingData.pointsUsed = Number.parseInt(document.getElementById("pointsToUse")?.value) || 0
      break
  }
}


// Toggle addon selection
function toggleAddon(addonId) {
  const checkbox = document.getElementById(addonId)
  checkbox.checked = !checkbox.checked
  updatePricing()
}


// Update base price based on duration (all prices in INR ₹)
function updateBasePrice() {
  const duration = document.getElementById("duration")?.value
  const priceMap = {
    2: 250,        // 2 Hours - ₹250
    4: 400,        // 4 Hours - ₹400
    8: 700,        // 8 Hours - ₹700
    24: 1200,      // Full Day (24 Hours) - ₹1,200
    weekly: 5800,  // Weekly - ₹5,800
    monthly: 20000,// Monthly - ₹20,000
  }


  bookingData.basePrice = priceMap[duration] || 0
  updatePricing()
}


// Update pricing calculation
function updatePricing() {
  let subtotal = bookingData.basePrice


  // Add addon prices (all in INR ₹)
  document.querySelectorAll('input[name="addons"]:checked').forEach((addon) => {
    subtotal += Number.parseInt(addon.value)
  })


  // Calculate discount from points
  // 100 points = ₹10 discount (changed from $1)
  const pointsUsed = Number.parseInt(document.getElementById("pointsToUse")?.value) || 0
  const discount = (pointsUsed / 100) * 10


  const total = Math.max(0, subtotal - discount)


  // Update display with ₹ symbol
  if (document.getElementById("subtotalAmount")) {
    document.getElementById("subtotalAmount").textContent = `₹${subtotal.toLocaleString('en-IN')}`
  }


  if (document.getElementById("discountAmount")) {
    document.getElementById("discountAmount").textContent = `-₹${discount.toFixed(2)}`
    const discountRow = document.getElementById("discountRow")
    if (discountRow) {
      discountRow.style.display = discount > 0 ? "flex" : "none"
    }
  }


  if (document.getElementById("totalAmount")) {
    document.getElementById("totalAmount").textContent = `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }


  // Calculate points earned (5% of total as points)
  const pointsEarned = Math.floor(total * 5)
  if (document.getElementById("pointsEarned")) {
    document.getElementById("pointsEarned").textContent = pointsEarned
  }
}


// Populate booking summary
function populateBookingSummary() {
  // Location
  const locationText = `${bookingData.location.address}, ${bookingData.location.city}, ${bookingData.location.zipcode}`
  if (document.getElementById("summaryLocation")) {
    document.getElementById("summaryLocation").textContent = locationText
  }


  // Vehicle
  const vehicleText = `${bookingData.vehicle.year} ${bookingData.vehicle.make} ${bookingData.vehicle.model} (${bookingData.vehicle.color}) - ${bookingData.vehicle.licensePlate}`
  if (document.getElementById("summaryVehicle")) {
    document.getElementById("summaryVehicle").textContent = vehicleText
  }


  // Schedule
  const durationText = document.getElementById("duration")?.selectedOptions[0]?.text || ""
  const scheduleText = `${bookingData.schedule.date} at ${bookingData.schedule.time} - ${durationText}`
  if (document.getElementById("summarySchedule")) {
    document.getElementById("summarySchedule").textContent = scheduleText
  }


  // Services
  const selectedAddons = Array.from(document.querySelectorAll('input[name="addons"]:checked')).map((addon) => {
    const card = addon.closest(".addon-card")
    return card?.querySelector("h3")?.textContent || ""
  })


  const servicesText = selectedAddons.length > 0 ? `Valet Parking + ${selectedAddons.join(", ")}` : "Valet Parking Only"
  if (document.getElementById("summaryServices")) {
    document.getElementById("summaryServices").textContent = servicesText
  }


  // Update pricing one more time
  updatePricing()
}


// Handle booking submission - UPDATED TO USE BACKEND API
async function handleBookingSubmit(e) {
  e.preventDefault()


  if (!document.getElementById("termsAccept")?.checked) {
    alert("Please accept the terms of service")
    return
  }


  // Calculate final totals
  const pointsUsed = Number.parseInt(document.getElementById("pointsToUse")?.value) || 0
  const totalText = document.getElementById("totalAmount")?.textContent.replace("₹", "").replace(/,/g, "") || "0"
  const subtotalText = document.getElementById("subtotalAmount")?.textContent.replace("₹", "").replace(/,/g, "") || "0"
  
  const totalAmount = Number.parseFloat(totalText)
  const subtotal = Number.parseFloat(subtotalText)


  // Prepare booking request for backend
  const bookingRequest = {
    userId: currentUser.id,
    vehicle: {
      make: bookingData.vehicle.make,
      model: bookingData.vehicle.model,
      year: parseInt(bookingData.vehicle.year),
      color: bookingData.vehicle.color,
      licensePlate: bookingData.vehicle.licensePlate
    },
    location: {
      address: bookingData.location.address,
      city: bookingData.location.city,
      zipcode: bookingData.location.zipcode,
      area: bookingData.location.area
    },
    pickupDate: bookingData.schedule.date,
    pickupTime: bookingData.schedule.time,
    duration: bookingData.schedule.duration,
    basePrice: bookingData.basePrice,
    subtotal: subtotal,
    pointsUsed: pointsUsed,
    totalAmount: totalAmount
  }


  try {
    // Send booking to backend
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingRequest)
    })


    if (!response.ok) {
      const errorText = await response.text()
      alert("Booking failed: " + (errorText || "Please try again"))
      return
    }


    const bookingResponse = await response.json()


    // Update user points in localStorage
    currentUser.points = currentUser.points - pointsUsed + (bookingResponse.pointsEarned || 0)
    localStorage.setItem("currentUser", JSON.stringify(currentUser))


    // Show confirmation modal
    if (document.getElementById("bookingIdDisplay")) {
      document.getElementById("bookingIdDisplay").textContent = bookingResponse.bookingId
    }
    if (document.getElementById("confirmationModal")) {
      document.getElementById("confirmationModal").classList.add("show")
    }


    console.log("[v0] Booking confirmed:", bookingResponse.bookingId)


  } catch (error) {
    console.error("Booking error:", error)
    alert("Network error. Please check if backend is running on port 8080.")
  }
}


function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser") || "null")
}


console.log("[v0] Booking script loaded with backend integration - INR Currency")
