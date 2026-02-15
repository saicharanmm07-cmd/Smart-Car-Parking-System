let currentUser = null
let allBookings = []
let currentFilter = "all"
let selectedBookingId = null

const API_BASE_URL = "http://localhost:8080/api"

// Initialize bookings page
document.addEventListener("DOMContentLoaded", () => {
  currentUser = getCurrentUser()
  if (!currentUser) {
    window.location.href = "login.html"
    return
  }

  loadUserBookings()
  console.log("[v0] Bookings page initialized for user:", currentUser.firstName)
})

// Load user's bookings - UPDATED TO USE BACKEND API
async function loadUserBookings() {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/user/${currentUser.id}`)
    
    if (!response.ok) {
      console.error("Failed to load bookings")
      allBookings = []
      renderBookings(allBookings)
      return
    }

    allBookings = await response.json()

    // Sort by date (newest first)
    allBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    renderBookings(allBookings)

  } catch (error) {
    console.error("Error loading bookings:", error)
    allBookings = []
    renderBookings(allBookings)
  }
}

// Render bookings list
function renderBookings(bookings) {
  const bookingsList = document.getElementById("bookingsList")

  // Filter bookings
  const filteredBookings = currentFilter === "all" ? bookings : bookings.filter((b) => b.status === currentFilter)

  if (filteredBookings.length === 0) {
    bookingsList.innerHTML = `
      <div class="empty-state">
        <h3>You don't have any ${currentFilter === "all" ? "" : currentFilter} bookings yet</h3>
        <p>Book your first valet service to get started</p>
        <button class="btn-primary" onclick="window.location.href='booking.html'">Book Your First Valet</button>
      </div>
    `
    return
  }

  bookingsList.innerHTML = ""
  filteredBookings.forEach((booking) => {
    const statusClass = booking.status.toLowerCase()
    const statusEmoji = {
      confirmed: "✓",
      "in-progress": "🚗",
      completed: "✓",
      cancelled: "✕",
    }

    const card = document.createElement("div")
    card.className = "booking-card"
    card.innerHTML = `
      <div class="booking-header">
        <div>
          <h3>#${booking.bookingId}</h3>
          <p class="booking-date">${booking.pickupDate} at ${booking.pickupTime}</p>
        </div>
        <span class="status-badge status-${statusClass}">
          ${statusEmoji[booking.status]} ${booking.status}
        </span>
      </div>
      
      <div class="booking-details">
        <div class="detail-row">
          <span class="detail-label">📍 Location:</span>
          <span>${booking.locationId}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">🚗 Vehicle:</span>
          <span>${booking.vehicleId}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">⏱ Duration:</span>
          <span>${booking.duration}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">💰 Total:</span>
          <span class="price">$${booking.total.toFixed(2)}</span>
        </div>
      </div>

      <div class="booking-actions">
        <button class="btn-secondary btn-sm" onclick="viewBookingDetails('${booking.bookingId}')">View Details</button>
        ${booking.status === "confirmed" ? 
          `<button class="btn-danger btn-sm" onclick="cancelBooking('${booking.bookingId}')">Cancel Booking</button>` 
          : ''}
      </div>
    `

    bookingsList.appendChild(card)
  })
}

// Filter bookings
function filterBookings(filter) {
  currentFilter = filter

  // Update active filter button
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active")
  })
  event.target.classList.add("active")

  renderBookings(allBookings)
}

// View booking details
function viewBookingDetails(bookingId) {
  alert(`Viewing details for booking #${bookingId}`)
  // In a real app, would show a modal with full booking details
}

// Cancel booking - UPDATED TO USE BACKEND API
async function cancelBooking(bookingId) {
  if (!confirm("Are you sure you want to cancel this booking?")) {
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
      method: "PUT"
    })

    if (!response.ok) {
      alert("Failed to cancel booking")
      return
    }

    alert("Booking cancelled successfully")
    loadUserBookings() // Reload bookings

  } catch (error) {
    console.error("Cancel booking error:", error)
    alert("Network error. Please check if backend is running.")
  }
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser") || null)
}

console.log("[v0] Bookings script loaded with backend integration")
