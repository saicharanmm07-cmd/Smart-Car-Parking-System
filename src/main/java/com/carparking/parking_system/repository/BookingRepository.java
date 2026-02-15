package com.carparking.parking_system.repository;

import com.carparking.parking_system.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByUserId(Long userId);
    
    List<Booking> findByUserIdAndStatus(Long userId, String status);
    
    Optional<Booking> findByBookingId(String bookingId);
    
    List<Booking> findTop20ByOrderByCreatedAtDesc();
    
    long countByStatus(String status);
    
    // Find bookings by user (using User entity reference)
    List<Booking> findByUser_Id(Long userId);
}