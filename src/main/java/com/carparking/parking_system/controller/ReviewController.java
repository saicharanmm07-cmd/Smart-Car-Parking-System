package com.carparking.parking_system.controller;

import com.carparking.parking_system.dto.ReviewRequest;
import com.carparking.parking_system.entity.Review;
import com.carparking.parking_system.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody ReviewRequest request) {
        Review review = reviewService.createReview(request);
        return ResponseEntity.ok(review);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getReviews(@PathVariable Long userId) {
        List<Review> reviews = reviewService.getReviews(userId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/pending/{userId}")
    public ResponseEntity<List<String>> getPendingReviews(@PathVariable Long userId) {
        List<String> pending = reviewService.getPendingReviews(userId);
        return ResponseEntity.ok(pending);
    }
}
