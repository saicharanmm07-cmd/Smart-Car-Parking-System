// Admin Dashboard JavaScript - CORRECTED
const API_BASE = 'http://localhost:8080/api';
let stompClient = null;
let currentAdmin = null;

// Check authentication
document.addEventListener('DOMContentLoaded', function() {
    currentAdmin = JSON.parse(localStorage.getItem('currentAdmin')) || { name: 'Admin' };
    
    const adminNameEl = document.getElementById('adminName');
    if (adminNameEl) {
        adminNameEl.textContent = `Welcome, ${currentAdmin.name || 'Admin'}`;
    }

    setTimeout(() => {
        connectWebSocket();
        fetchStats();
        fetchBookings();
        fetchUsers();
    }, 500);
});

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentAdmin');
        window.location.href = 'admin-login.html';
    }
}

// WebSocket Connection
function connectWebSocket() {
    try {
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient = Stomp.over(socket);
        
        stompClient.connect({}, function(frame) {
            console.log('✅ WebSocket Connected');
            
            stompClient.subscribe('/topic/admin/notifications', function(notification) {
                try {
                    const data = JSON.parse(notification.body);
                    handleNotification(data);
                } catch (e) {
                    console.error('Notification parse error:', e);
                }
            });
        }, function(error) {
            console.error('❌ WebSocket Error:', error);
            setTimeout(connectWebSocket, 5000);
        });
    } catch (error) {
        console.error('WebSocket setup error:', error);
    }
}

// Handle Notifications
function handleNotification(data) {
    playNotificationSound();
    
    if (data.type === 'NEW_BOOKING') {
        showNotification(`🔔 New Booking #${data.bookingId} from User #${data.userId}`, 'new-booking');
    } else {
        showNotification(data.message || 'New notification');
    }
    
    setTimeout(() => {
        fetchBookings();
        fetchStats();
    }, 1000);
}

function playNotificationSound() {
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ0PVqzn77BdGAg+ltryxnMpBSl+zPLaizsIHGi57OihUQ0NVKvn8bVgGQc8ldb0zHosBSh6y/LajDwIF2S46+mhUQ0PVKzn8bNeGQc4k9TyzHkrBSZ4yPDcizwIGGG26+mjUg0OUqnm8bJeGgc4kdPyyXkrBSV2x+/ciTwIFmG16uilUw0NUajl8LFgGwc2j9H0xncrBSR0xu/ciTwIF1+06eqnVA0MUKfl77BgGwc1jtDzxXYpBSJyxe7diz0IF1206eqnVA0LT6Xk7q9hGwc0jc/zw3YpBSJww+3di0AJGF+16OqnVA0LTqTj7q5iHAczi87yw3YpBSBvwuzci');
        audio.play().catch(e => console.log('Sound blocked'));
    } catch (e) {
        console.log('Sound error');
    }
}

function showNotification(message, className = '') {
    const notif = document.getElementById('notification');
    if (!notif) return;
    
    notif.textContent = message;
    notif.className = 'notification show ' + className;
    setTimeout(() => notif.classList.remove('show'), 5000);
}

// Fetch Stats
async function fetchStats() {
    try {
        const response = await fetch(`${API_BASE}/admin/dashboard/stats`);
        
        if (!response.ok) {
            console.error('Stats error:', response.status);
            return;
        }
        
        const data = await response.json();
        console.log('📊 Stats:', data);
        
        document.getElementById('totalBookings').textContent = data.totalBookings || 0;
        document.getElementById('totalUsers').textContent = data.totalUsers || 0;
        document.getElementById('pendingBookings').textContent = data.pendingBookings || 0;
        document.getElementById('totalRevenue').textContent = '₹' + (data.totalRevenue || 0);
    } catch (error) {
        console.error('❌ Stats error:', error);
    }
}

// Fetch Bookings
async function fetchBookings() {
    try {
        console.log('📋 Fetching bookings...');
        const response = await fetch(`${API_BASE}/admin/bookings`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const bookings = await response.json();
        console.log('✅ Bookings:', bookings);
        
        const bookingsTable = document.getElementById('bookingsTable');
        if (!bookingsTable) return;
        
        if (!bookings || bookings.length === 0) {
            bookingsTable.innerHTML = '<p class="empty-state">📭 No bookings found</p>';
            return;
        }

        const tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Pickup Date</th>
                        <th>Pickup Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${bookings.map(booking => `
                        <tr>
                            <td><strong>#${booking.id}</strong></td>
                            <td>${booking.user?.firstName || 'Unknown'} ${booking.user?.lastName || ''}</td>
                            <td>${booking.user?.email || 'N/A'}</td>
                            <td>${booking.pickupDate || 'N/A'}</td>
                            <td>${booking.pickupTime || 'N/A'}</td>
                            <td><span class="status-badge status-${(booking.status || 'pending').toLowerCase()}">${booking.status || 'Pending'}</span></td>
                            <td>
                                ${booking.status === 'PENDING' ? `
                                    <button class="btn btn-approve" onclick="updateStatus(${booking.id}, 'CONFIRMED')">✓ Approve</button>
                                    <button class="btn btn-reject" onclick="updateStatus(${booking.id}, 'REJECTED')">✕ Reject</button>
                                ` : `
                                    <button class="btn btn-view" onclick="viewBooking(${booking.id})">👁 View</button>
                                `}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        bookingsTable.innerHTML = tableHTML;
    } catch (error) {
        console.error('❌ Bookings error:', error);
        document.getElementById('bookingsTable').innerHTML = `<p class="empty-state">❌ Error: ${error.message}</p>`;
    }
}

// Update Status
async function updateStatus(bookingId, status) {
    try {
        const response = await fetch(`${API_BASE}/admin/bookings/${bookingId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            showNotification(`✅ Booking ${status.toLowerCase()}!`);
            setTimeout(() => {
                fetchBookings();
                fetchStats();
            }, 500);
        } else {
            showNotification('❌ Error updating status');
        }
    } catch (error) {
        console.error('❌ Update error:', error);
        showNotification('❌ Network error');
    }
}

function viewBooking(bookingId) {
    alert(`📋 Viewing Booking #${bookingId}`);
}

// Fetch Users
async function fetchUsers() {
    try {
        console.log('👥 Fetching users...');
        const response = await fetch(`${API_BASE}/admin/users`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const users = await response.json();
        console.log('✅ Users:', users);
        
        const usersTable = document.getElementById('usersTable');
        if (!usersTable) return;
        
        if (!users || users.length === 0) {
            usersTable.innerHTML = '<p class="empty-state">👥 No users found</p>';
            return;
        }

        const tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Points</th>
                        <th>Registered</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                        <tr>
                            <td>#${user.id}</td>
                            <td>${user.firstName || ''} ${user.lastName || ''}</td>
                            <td>${user.email || 'N/A'}</td>
                            <td>${user.phone || 'N/A'}</td>
                            <td><strong>${user.points || 0}</strong></td>
                            <td>${user.joinDate ? new Date(user.joinDate).toLocaleDateString('en-IN') : 'N/A'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        usersTable.innerHTML = tableHTML;
    } catch (error) {
        console.error('❌ Users error:', error);
        document.getElementById('usersTable').innerHTML = `<p class="empty-state">❌ Error: ${error.message}</p>`;
    }
}

// Auto-refresh
setInterval(() => {
    fetchStats();
    fetchBookings();
}, 30000);

console.log('✅ Admin Dashboard Loaded');