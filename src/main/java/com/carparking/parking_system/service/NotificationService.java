package com.carparking.parking_system.service;

import com.carparking.parking_system.entity.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationService {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    public void notifyAdmin(String message, String type, Long bookingId, Long userId) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("message", message);
        notification.put("type", type);
        notification.put("bookingId", bookingId);
        notification.put("userId", userId);
        notification.put("timestamp", System.currentTimeMillis());
        
        messagingTemplate.convertAndSend("/topic/admin/notifications", notification);
    }
    
    public void notifyUser(Long userId, String message, String type) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("message", message);
        notification.put("type", type);
        notification.put("timestamp", System.currentTimeMillis());
        
        messagingTemplate.convertAndSend("/topic/user/" + userId, notification);
    }
    
    public void notifyBookingStatusChange(Booking booking, String oldStatus) {
        String message = "Booking #" + booking.getId() + " status changed from " + oldStatus + " to " + booking.getStatus();
        notifyAdmin(message, "BOOKING_STATUS_CHANGE", booking.getId(), booking.getUser().getId());
    }
}