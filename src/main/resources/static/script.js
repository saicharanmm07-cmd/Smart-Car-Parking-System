// Smooth scrolling function
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: "smooth" })
  }
}

// Mobile menu toggle (placeholder - will be enhanced in later versions)
function toggleMenu() {
  alert("Mobile menu feature will be added in the next update!")
}

function checkAuthAndPersonalize() {
  const currentUser = getCurrentUser()

  if (!currentUser) {
    // Redirect to login if not authenticated
    const currentPage = window.location.pathname.split("/").pop()
    if (currentPage !== "login.html" && currentPage !== "signup.html" && currentPage !== "") {
      window.location.href = "login.html"
      return false
    }
  } else {
    // Update navigation with user info
    updateNavigationForUser(currentUser)
  }

  return true
}

function getCurrentUser() {
  const userJson = localStorage.getItem("currentUser")
  return userJson ? JSON.parse(userJson) : null
}

function updateNavigationForUser(user) {
  const navLinks = document.querySelector(".nav-links")
  if (!navLinks) return

  // Update points badge with user's actual points
  const pointsBadge = document.querySelector(".points-badge")
  if (pointsBadge) {
    pointsBadge.textContent = `🎁 ${user.points} Points`
  }

  // Replace "Get Started" button with user menu
  const getStartedBtn = navLinks.querySelector('button[onclick*="booking.html"]')
  if (getStartedBtn) {
    getStartedBtn.textContent = user.firstName
    getStartedBtn.style.background = "var(--navy-deep)"
    getStartedBtn.onclick = toggleUserMenu

    // Add logout option
    if (!document.getElementById("userDropdown")) {
      const dropdown = document.createElement("div")
      dropdown.id = "userDropdown"
      dropdown.className = "user-dropdown"
      dropdown.innerHTML = `
        <div class="user-info">
          <div class="user-avatar">${user.firstName[0]}${user.lastName[0]}</div>
          <div>
            <strong>${user.firstName} ${user.lastName}</strong>
            <small>${user.email}</small>
          </div>
        </div>
        <hr>
        <a href="rewards.html">My Rewards</a>
        <a href="reviews.html">My Reviews</a>
        <a href="booking.html">Book Service</a>
        <hr>
        <a href="#" onclick="logout(); return false;" style="color: var(--coral-primary);">Logout</a>
      `
      dropdown.style.display = "none"
      getStartedBtn.parentNode.appendChild(dropdown)
    }
  }
}

function toggleUserMenu() {
  const dropdown = document.getElementById("userDropdown")
  if (dropdown) {
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none"
  }
}

function logout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("currentUser")
    window.location.href = "login.html"
  }
}

// Initialize user points from localStorage
function initializePoints() {
  if (!localStorage.getItem("userPoints")) {
    localStorage.setItem("userPoints", "1250")
  }
  updatePointsDisplay()
}

// Update points display in navbar
function updatePointsDisplay() {
  const user = getCurrentUser()
  if (!user) return

  const points = user.points || 1250
  const pointsBadge = document.querySelector(".points-badge")
  if (pointsBadge) {
    pointsBadge.textContent = `🎁 ${points} Points`
  }
}

// Add points (called after booking)
function addPoints(points) {
  const user = getCurrentUser()
  if (!user) return

  user.points = (user.points || 1250) + points
  localStorage.setItem("currentUser", JSON.stringify(user))

  // Also update in users array
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const userIndex = users.findIndex((u) => u.id === user.id)
  if (userIndex !== -1) {
    users[userIndex].points = user.points
    localStorage.setItem("users", JSON.stringify(users))
  }

  updatePointsDisplay()
}

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar")
  if (window.scrollY > 50) {
    navbar.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.1)"
  } else {
    navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.05)"
  }
})

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  if (!checkAuthAndPersonalize()) {
    return
  }

  initializePoints()

  // Add entrance animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe feature cards
  document.querySelectorAll(".feature-card, .step").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "all 0.6s ease-out"
    observer.observe(el)
  })
})

const style = document.createElement("style")
style.textContent = `
  .user-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 10px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.15);
    min-width: 250px;
    z-index: 1001;
    padding: 1rem;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 0;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, var(--coral-primary), var(--mint-accent));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 0.9rem;
  }

  .user-info strong {
    display: block;
    color: var(--navy-deep);
    font-size: 0.95rem;
  }

  .user-info small {
    display: block;
    color: var(--navy-light);
    font-size: 0.8rem;
  }

  .user-dropdown hr {
    border: none;
    border-top: 1px solid var(--gray-medium);
    margin: 0.8rem 0;
  }

  .user-dropdown a {
    display: block;
    padding: 0.6rem 0.5rem;
    color: var(--navy-deep);
    text-decoration: none;
    border-radius: 6px;
    transition: all 0.3s;
    font-size: 0.9rem;
  }

  .user-dropdown a:hover {
    background: var(--gray-light);
    padding-left: 1rem;
  }
`
document.head.appendChild(style)

console.log("[v0] Landing page loaded successfully")
