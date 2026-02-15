package com.carparking.parking_system.service;

import com.carparking.parking_system.dto.BookingRequest;
import com.carparking.parking_system.entity.*;
import com.carparking.parking_system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public Booking createBooking(BookingRequest request) {
        // Get user
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create and save vehicle
        Vehicle vehicle = new Vehicle();
        vehicle.setUser(user);
        vehicle.setMake(request.getVehicle().getMake());
        vehicle.setModel(request.getVehicle().getModel());
        vehicle.setYear(request.getVehicle().getYear());
        vehicle.setColor(request.getVehicle().getColor());
        vehicle.setLicensePlate(request.getVehicle().getLicensePlate());
        vehicle = vehicleRepository.save(vehicle);

        // Create and save location
        Location location = new Location();
        location.setUser(user);
        location.setAddress(request.getLocation().getAddress());
        location.setCity(request.getLocation().getCity());
        location.setZipcode(request.getLocation().getZipcode());
        location.setArea(request.getLocation().getArea());
        location = locationRepository.save(location);

        // Calculate pricing
        BigDecimal basePrice = request.getBasePrice() != null ? request.getBasePrice() : BigDecimal.valueOf(100);
        BigDecimal subtotal = request.getSubtotal() != null ? request.getSubtotal() : basePrice;
        Integer pointsUsed = request.getPointsUsed() != null ? request.getPointsUsed() : 0;
        BigDecimal discount = BigDecimal.valueOf(pointsUsed * 0.1);
        BigDecimal total = subtotal.subtract(discount);
        Integer pointsEarned = total.multiply(BigDecimal.valueOf(0.05)).intValue();

        // Create booking
        Booking booking = new Booking();
        booking.setBookingId("PV" + UUID.randomUUID().toString().substring(0, 13).replace("-", "").toUpperCase());
        booking.setUser(user);
        booking.setVehicle(vehicle);
        booking.setLocation(location);
        booking.setPickupDate(request.getPickupDate());
        booking.setPickupTime(request.getPickupTime());
        booking.setDuration(request.getDuration());
        booking.setBasePrice(basePrice);
        booking.setSubtotal(subtotal);
        booking.setPointsUsed(pointsUsed);
        booking.setDiscount(discount);
        booking.setTotal(total);
        booking.setPointsEarned(pointsEarned);
        booking.setStatus("PENDING");
        booking.setCreatedAt(LocalDateTime.now());

        booking = bookingRepository.save(booking);

        // Update user points
        user.setPoints(user.getPoints() - pointsUsed + pointsEarned);
        userRepository.save(user);

        // Send notification to admin
        notificationService.notifyAdmin(
                "New booking #" + booking.getId() + " from " + user.getFirstName(),
                "NEW_BOOKING",
                booking.getId(),
                user.getId()
        );

        return booking;
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getUserBookingsByStatus(Long userId, String status) {
        return bookingRepository.findByUserIdAndStatus(userId, status);
    }

    public Booking getBookingByBookingId(String bookingId) {
        return bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));
    }

    @Transactional
    public void cancelBooking(String bookingId) {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);

        // Refund points
        User user = booking.getUser();
        user.setPoints(user.getPoints() + booking.getPointsUsed() - booking.getPointsEarned());
        userRepository.save(user);
        
        // Notify admin
        notificationService.notifyAdmin(
                "Booking #" + booking.getId() + " was cancelled",
                "BOOKING_CANCELLED",
                booking.getId(),
                user.getId()
        );
    }
}