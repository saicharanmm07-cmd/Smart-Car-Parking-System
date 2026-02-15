package com.carparking.parking_system.controller;

import com.carparking.parking_system.dto.BookingRequest;
import com.carparking.parking_system.entity.Booking;
import com.carparking.parking_system.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        try {
            Booking booking = bookingService.createBooking(request);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable Long userId) {
        List<Booking> bookings = bookingService.getUserBookings(userId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<List<Booking>> getUserBookingsByStatus(
            @PathVariable Long userId,
            @PathVariable String status) {
        List<Booking> bookings = bookingService.getUserBookingsByStatus(userId, status);
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable String bookingId) {
        try {
            bookingService.cancelBooking(bookingId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Booking cancelled successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getBookingById(@PathVariable String bookingId) {
        try {
            Booking booking = bookingService.getBookingByBookingId(bookingId);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}