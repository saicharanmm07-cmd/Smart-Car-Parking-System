package com.carparking.parking_system.service;

import com.carparking.parking_system.entity.PointsHistory;
import com.carparking.parking_system.entity.User;
import com.carparking.parking_system.repository.PointsHistoryRepository;
import com.carparking.parking_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PointsService {
    
    @Autowired
    private PointsHistoryRepository pointsHistoryRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<PointsHistory> getPointsHistory(Long userId) {
        return pointsHistoryRepository.findByUserId(userId);
    }

    @Transactional
    public void redeemPoints(Long userId, Integer points, String description) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getPoints() < points) {
            throw new RuntimeException("Insufficient points balance");
        }
        
        // Deduct points from user
        user.setPoints(user.getPoints() - points);
        userRepository.save(user);
        
        // Record points history
        PointsHistory history = new PointsHistory();
        history.setUser(user);
        history.setType("REDEEMED");
        history.setPoints(-points);
        history.setDescription(description);
        history.setCreatedAt(LocalDateTime.now());
        pointsHistoryRepository.save(history);
    }

    @Transactional
    public void addPoints(Long userId, Integer points, String description) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Add points to user
        user.setPoints(user.getPoints() + points);
        userRepository.save(user);
        
        // Record points history
        PointsHistory history = new PointsHistory();
        history.setUser(user);
        history.setType("EARNED");
        history.setPoints(points);
        history.setDescription(description);
        history.setCreatedAt(LocalDateTime.now());
        pointsHistoryRepository.save(history);
    }

    public Integer getUserPoints(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getPoints();
    }
}
