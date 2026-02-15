// Rewards system state
let currentUser = null
let currentPoints = 0
let pendingRedemption = null

const API_BASE_URL = "http://localhost:8080/api"

// Initialize rewards dashboard
document.addEventListener("DOMContentLoaded", () => {
  currentUser = getCurrentUser()
  if (!currentUser) {
    window.location.href = "login.html"
    return
  }

  currentPoints = currentUser.points || 0

  initializeRewardsDashboard()
  loadPointsHistory()
  updateRedeemButtons()

  console.log("[v0] Rewards dashboard initialized with user:", currentUser.firstName)
})

// Initialize dashboard with user data
function initializeRewardsDashboard() {
  // Update points display
  document.getElementById("totalPoints").textContent = currentPoints.toLocaleString()
  document.getElementById("pointsWorth").textContent = (currentPoints / 100).toFixed(2)

  // Update member tier
  updateMemberTier()
}

// Update member tier based on points
function updateMemberTier() {
  const tierBadge = document.querySelector(".tier-badge")
  const tierSubtitle = document.querySelector(".stat-subtitle")

  if (currentPoints >= 3000) {
    tierBadge.textContent = "Platinum"
    tierSubtitle.textContent = "Top Tier!"
    updateTierDisplay("platinum")
  } else if (currentPoints >= 1500) {
    tierBadge.textContent = "Gold"
    tierSubtitle.textContent = 3000 - currentPoints + " points to Platinum"
    updateTierDisplay("gold")
  } else {
    tierBadge.textContent = "Silver"
    tierSubtitle.textContent = 1500 - currentPoints + " points to Gold"
    updateTierDisplay("silver")
  }
}

// Update tier visual display
function updateTierDisplay(tier) {
  document.querySelectorAll(".tier-level").forEach((level) => {
    level.classList.remove("active")
  })

  const tierIndex = { silver: 0, gold: 1, platinum: 2 }
  const levels = document.querySelectorAll(".tier-level")

  if (levels[tierIndex[tier]]) {
    levels[tierIndex[tier]].classList.add("active")
  }
}

// Load points history - UPDATED TO USE BACKEND API
async function loadPointsHistory() {
  const historyList = document.getElementById("historyList")

  try {
    const response = await fetch(`${API_BASE_URL}/points/history/${currentUser.id}`)
    
    if (!response.ok) {
      historyList.innerHTML = '<div class="empty-state"><p>No history found</p></div>'
      return
    }

    const history = await response.json()
    renderHistory(history)

  } catch (error) {
    console.error("Error loading points history:", error)
    historyList.innerHTML = '<div class="empty-state"><p>Failed to load history</p></div>'
  }
}

// Render history items
function renderHistory(history, filter = "all") {
  const historyList = document.getElementById("historyList")
  historyList.innerHTML = ""

  const filteredHistory = filter === "all" ? history : history.filter((item) => item.type === filter)

  if (filteredHistory.length === 0) {
    historyList.innerHTML = '<div class="empty-state"><p>No history found</p></div>'
    return
  }

  filteredHistory.forEach((item) => {
    const historyItem = document.createElement("div")
    historyItem.className = "history-item"

    const icon = item.points > 0 ? "💰" : "🎁"
    const pointsClass = item.points > 0 ? "positive" : "negative"
    const pointsSign = item.points > 0 ? "+" : ""

    historyItem.innerHTML = `
      <div class="history-icon">${icon}</div>
      <div class="history-details">
        <div class="history-description">${item.description}</div>
        <div class="history-date">${item.date}</div>
      </div>
      <div class="history-points ${pointsClass}">
        ${pointsSign}${item.points}
      </div>
    `

    historyList.appendChild(historyItem)
  })
}

// Filter history
function filterHistory(filter) {
  loadPointsHistory() // Reload from backend with filter if needed
}

// Update redeem buttons based on available points
function updateRedeemButtons() {
  document.querySelectorAll(".reward-card button").forEach((btn) => {
    const points = Number.parseInt(btn.dataset.points)
    btn.disabled = points > currentPoints
  })
}

// Redeem reward
function redeemReward(rewardName, pointsCost) {
  if (pointsCost > currentPoints) {
    alert("Not enough points for this reward")
    return
  }

  pendingRedemption = { name: rewardName, cost: pointsCost }
  document.getElementById("confirmRewardName").textContent = rewardName
  document.getElementById("confirmPointsCost").textContent = pointsCost
  document.getElementById("remainingPoints").textContent = currentPoints - pointsCost
  document.getElementById("confirmRedeemModal").classList.add("show")
}

// Confirm redemption - UPDATED TO USE BACKEND API
async function confirmRedemption() {
  if (!pendingRedemption) return

  try {
    const response = await fetch(`${API_BASE_URL}/points/redeem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: currentUser.id,
        points: pendingRedemption.cost,
        description: `Redeemed: ${pendingRedemption.name}`
      })
    })

    if (!response.ok) {
      alert("Redemption failed")
      return
    }

    // Update local points
    currentPoints -= pendingRedemption.cost
    currentUser.points = currentPoints
    localStorage.setItem("currentUser", JSON.stringify(currentUser))

    closeRedeemModal()
    initializeRewardsDashboard()
    loadPointsHistory()
    updateRedeemButtons()

    alert(`Successfully redeemed ${pendingRedemption.name}!`)

  } catch (error) {
    console.error("Redemption error:", error)
    alert("Network error. Please check if backend is running.")
  }
}

function closeRedeemModal() {
  document.getElementById("confirmRedeemModal").classList.remove("show")
  pendingRedemption = null
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser") || null)
}

console.log("[v0] Rewards script loaded with backend integration")
