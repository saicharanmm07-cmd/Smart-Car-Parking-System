package com.carparking.parking_system.controller;

import com.carparking.parking_system.entity.PointsHistory;
import com.carparking.parking_system.service.PointsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/points")
@CrossOrigin(origins = "*")
public class PointsController {

    @Autowired
    private PointsService pointsService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PointsHistory>> getPointsHistory(@PathVariable Long userId) {
        List<PointsHistory> history = pointsService.getPointsHistory(userId);
        return ResponseEntity.ok(history);
    }

    @PostMapping("/redeem")
    public ResponseEntity<?> redeemPoints(@RequestBody Map<String, Object> request) {
        Long userId = Long.parseLong(request.get("userId").toString());
        Integer points = Integer.parseInt(request.get("points").toString());
        String description = request.get("description").toString();

        pointsService.redeemPoints(userId, points, description);
        return ResponseEntity.ok("Points redeemed successfully");
    }
}
