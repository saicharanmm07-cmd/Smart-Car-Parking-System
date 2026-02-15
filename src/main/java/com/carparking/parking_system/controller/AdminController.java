package com.carparking.parking_system.controller;

import com.carparking.parking_system.entity.Booking;
import com.carparking.parking_system.entity.User;
import com.carparking.parking_system.repository.BookingRepository;
import com.carparking.parking_system.repository.UserRepository;
import com.carparking.parking_system.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalBookings = bookingRepository.count();
        stats.put("totalBookings", totalBookings);
        
        long totalUsers = userRepository.count();
        stats.put("totalUsers", totalUsers);
        
        long pendingBookings = bookingRepository.countByStatus("PENDING");
        stats.put("pendingBookings", pendingBookings);
        
        stats.put("totalRevenue", 0);
        stats.put("message", "Dashboard statistics retrieved successfully");
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/bookings/{bookingId}/status")
    public ResponseEntity<Map<String, String>> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestBody Map<String, String> request) {
        
        String newStatus = request.get("status");
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        String oldStatus = booking.getStatus();
        booking.setStatus(newStatus);
        bookingRepository.save(booking);
        
        notificationService.notifyBookingStatusChange(booking, oldStatus);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Booking status updated to: " + newStatus);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/bookings/{bookingId}")
    public ResponseEntity<Map<String, String>> deleteBooking(@PathVariable Long bookingId) {
        bookingRepository.deleteById(bookingId);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Booking deleted successfully");
        
        return ResponseEntity.ok(response);
    }
}