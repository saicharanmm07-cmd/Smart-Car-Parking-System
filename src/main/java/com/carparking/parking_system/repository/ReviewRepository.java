package com.carparking.parking_system.repository;

import com.carparking.parking_system.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByUserId(Long userId);
    List<Review> findByBookingId(Long bookingId);  // CHANGED FROM String TO Long
}