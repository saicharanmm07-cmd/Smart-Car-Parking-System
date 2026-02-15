package com.carparking.parking_system.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Store user by id for simplicity
    @Column(name = "user_id")
    private Long userId;

    // FIXED: Changed from String to Long to match Booking.id type
    @Column(name = "booking_id")
    private Long bookingId;

    private Integer rating;

    @Column(length = 1000)
    private String comment;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and setters
    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }

    public Long getUserId() { 
        return userId; 
    }
    
    public void setUserId(Long userId) { 
        this.userId = userId; 
    }

    public Long getBookingId() { 
        return bookingId; 
    }
    
    public void setBookingId(Long bookingId) { 
        this.bookingId = bookingId; 
    }

    public Integer getRating() { 
        return rating; 
    }
    
    public void setRating(Integer rating) { 
        this.rating = rating; 
    }

    public String getComment() { 
        return comment; 
    }
    
    public void setComment(String comment) { 
        this.comment = comment; 
    }

    public LocalDateTime getCreatedAt() { 
        return createdAt; 
    }
    
    public void setCreatedAt(LocalDateTime createdAt) { 
        this.createdAt = createdAt; 
    }
}