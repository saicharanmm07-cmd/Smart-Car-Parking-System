package com.carparking.parking_system.service;

import com.carparking.parking_system.dto.ReviewRequest;
import com.carparking.parking_system.entity.Review;
import com.carparking.parking_system.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public List<Review> getReviews(Long userId) {
        return reviewRepository.findByUserId(userId);
    }

    public Review createReview(ReviewRequest request) {
        Review review = new Review();
        review.setUserId(request.getUserId());
        review.setBookingId(request.getBookingId());
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        return reviewRepository.save(review);
    }

    public List<String> getPendingReviews(Long userId) {
        // simple placeholder: all bookingIds without review
        // adjust later if you have a real logic
        return List.of();
    }
}
