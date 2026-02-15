package com.carparking.parking_system.controller;

import com.carparking.parking_system.entity.Admin;
import com.carparking.parking_system.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/auth")
@CrossOrigin(origins = "*")
public class AdminAuthController {

    @Autowired
    private AdminRepository adminRepository;

    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Admin admin = adminRepository.findByEmail(email);
        
        if (admin == null) {
            return ResponseEntity.status(401).body("Admin not found");
        }

        if (!admin.getPassword().equals(password)) {
            return ResponseEntity.status(401).body("Invalid password");
        }

        if (!admin.getIsActive()) {
            return ResponseEntity.status(403).body("Admin account is inactive");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("id", admin.getId());
        response.put("email", admin.getEmail());
        response.put("name", admin.getName());
        response.put("role", admin.getRole());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createAdmin(@RequestBody Map<String, String> adminData) {
        String email = adminData.get("email");
        
        if (adminRepository.findByEmail(email) != null) {
            return ResponseEntity.status(400).body("Admin with this email already exists");
        }

        Admin admin = new Admin();
        admin.setEmail(email);
        admin.setPassword(adminData.get("password"));
        admin.setName(adminData.get("name"));
        admin.setRole("ADMIN");
        admin.setIsActive(true);

        Admin savedAdmin = adminRepository.save(admin);

        Map<String, Object> response = new HashMap<>();
        response.put("id", savedAdmin.getId());
        response.put("email", savedAdmin.getEmail());
        response.put("name", savedAdmin.getName());
        response.put("message", "Admin account created successfully");

        return ResponseEntity.ok(response);
    }
}