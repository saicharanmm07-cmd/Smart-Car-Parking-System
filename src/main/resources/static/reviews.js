// Reviews system state
let currentReviewBookingId = null
let selectedTags = []
let ratings = {
  driver: 0,
  service: 0,
  wash: 0,
}
const API_BASE_URL = "http://localhost:8080/api"

// Initialize reviews page
document.addEventListener("DOMContentLoaded", () => {
  initializeReviewsPage()
  setupStarRatings()
  setupFeedbackTags()

  // Form submission
  const reviewForm = document.getElementById("reviewForm")
  if (reviewForm) {
    reviewForm.addEventListener("submit", handleReviewSubmit)
  }

  console.log("[v0] Reviews system initialized")
})

// Initialize the reviews page
function initializeReviewsPage() {
  loadPendingReviews()
  loadSubmittedReviews()
  updateReviewStats()
}

// Load pending reviews from backend for the user
async function loadPendingReviews() {
  const pendingList = document.getElementById("pendingReviewsList")
  const currentUser = getCurrentUser()
  if (!currentUser) return

  try {
    // Backend must provide bookings pending review for the user
    const resp = await fetch(`${API_BASE_URL}/reviews/pending/${currentUser.id}`)
    if (!resp.ok) {
      pendingList.innerHTML = "No pending reviews. Book a service to leave a review!"
      return
    }
    const pendingReviews = await resp.json()
    if (!pendingReviews.length) {
      pendingList.innerHTML = "No pending reviews. Book a service to leave a review!"
      return
    }
    pendingList.innerHTML = ""
    pendingReviews.forEach((review) => {
      const card = document.createElement("div")
      card.className = "pending-review-card"
      card.innerHTML = `
        <div><strong>#${review.bookingId}</strong> - ${review.vehicle}</div>
        <div>Date: ${review.pickupDate} Time: ${review.pickupTime}</div>
        <button onclick="openReviewModal('${review.bookingId}')">Leave Review</button>
      `
      pendingList.appendChild(card)
    })
  } catch (error) {
    pendingList.innerHTML = "Failed to load pending reviews."
  }
}

window.openReviewModal = function(bookingId) {
  currentReviewBookingId = bookingId
  selectedTags = []
  ratings = { driver: 0, service: 0, wash: 0 }
  document.getElementById("reviewModal").classList.add("show")
}

// Load submitted reviews from backend for the user
async function loadSubmittedReviews() {
  const submittedList = document.getElementById("submittedReviewsList")
  const currentUser = getCurrentUser()
  if (!currentUser) return

  try {
    const resp = await fetch(`${API_BASE_URL}/reviews/user/${currentUser.id}`)
    if (!resp.ok) {
      submittedList.innerHTML = "No reviews submitted yet."
      return
    }
    const reviews = await resp.json()
    if (!reviews.length) {
      submittedList.innerHTML = "No reviews submitted yet."
      return
    }
    renderReviews(reviews)
  } catch (error) {
    submittedList.innerHTML = "Failed to load submitted reviews."
  }
}

// Render reviews
function renderReviews(reviews, filter = "all") {
  const reviewsList = document.getElementById("submittedReviewsList")
  reviewsList.innerHTML = ""
  let filteredReviews = reviews
  if (filter === "5") {
    filteredReviews = reviews.filter((r) => r.serviceRating === 5 || r.driverRating === 5)
  } else if (filter === "4") {
    filteredReviews = reviews.filter((r) => r.serviceRating === 4 || r.driverRating === 4)
  } else if (filter === "low") {
    filteredReviews = reviews.filter((r) => r.serviceRating <= 3 || r.driverRating <= 3)
  }
  if (filteredReviews.length === 0) {
    reviewsList.innerHTML = 'No reviews found for this filter.'
    return
  }
  filteredReviews.forEach((review) => {
    const card = document.createElement("div")
    card.className = "review-card"
    const generateStars = (rating) => "★".repeat(rating) + "☆".repeat(5 - rating)
    card.innerHTML = `
      <div>
        <strong>#${review.bookingId}</strong>
        <div>Driver: ${generateStars(review.driverRating)} | Service: ${generateStars(review.serviceRating)}${review.hadWash ? " | Wash: " + generateStars(review.washRating) : ""}</div>
        <div class="feedback-text">${review.feedback || ""}</div>
        <div class="review-tags">${(review.tags || []).map(t => `<span class="review-tag">${t}</span>`).join("")}</div>
        <div class="review-date">${review.createdAt || ""}</div>
      </div>
    `
    reviewsList.appendChild(card)
  })
}

// Star rating, tag selection etc. would be similar to your previous setup

// Submit review - POST to backend
async function handleReviewSubmit(e) {
  e.preventDefault()
  const currentUser = getCurrentUser()
  if (!currentUser || !currentReviewBookingId) return

  // Collect rating info
  const driverRating = ratings.driver
  const serviceRating = ratings.service
  const washRating = ratings.wash
  const feedback = document.getElementById("feedbackText")?.value || ""
  // Assume you have logic to read selected tags and hadWash if needed

  try {
    const reviewPayload = {
      userId: currentUser.id,
      bookingId: currentReviewBookingId,
      driverRating,
      serviceRating,
      washRating,
      feedback,
      tags: selectedTags // Array of tag strings
    }
    const resp = await fetch(`${API_BASE_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reviewPayload)
    })
    if (!resp.ok) {
      alert("Failed to submit review. Please try again!")
      return
    }
    document.getElementById("reviewModal").classList.remove("show")
    alert("Review submitted!")
    loadPendingReviews()
    loadSubmittedReviews()
  } catch (error) {
    alert("Network error! Please check if backend is running.")
  }
}

// Example stubs for ratings and tags (replace with your own logic)
function setupStarRatings() {}
function setupFeedbackTags() {}

function updateReviewStats() {}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser") || "null")
}
