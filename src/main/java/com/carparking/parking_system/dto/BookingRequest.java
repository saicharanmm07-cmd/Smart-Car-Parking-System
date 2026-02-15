package com.carparking.parking_system.dto;

import java.math.BigDecimal;

public class BookingRequest {
    
    private Long userId;
    private VehicleRequest vehicle;
    private LocationRequest location;
    private String pickupDate;
    private String pickupTime;
    private String duration;
    private BigDecimal basePrice;
    private BigDecimal subtotal;
    private Integer pointsUsed;

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public VehicleRequest getVehicle() { return vehicle; }
    public void setVehicle(VehicleRequest vehicle) { this.vehicle = vehicle; }

    public LocationRequest getLocation() { return location; }
    public void setLocation(LocationRequest location) { this.location = location; }

    public String getPickupDate() { return pickupDate; }
    public void setPickupDate(String pickupDate) { this.pickupDate = pickupDate; }

    public String getPickupTime() { return pickupTime; }
    public void setPickupTime(String pickupTime) { this.pickupTime = pickupTime; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public Integer getPointsUsed() { return pointsUsed; }
    public void setPointsUsed(Integer pointsUsed) { this.pointsUsed = pointsUsed; }

    // Nested classes for vehicle and location
    public static class VehicleRequest {
        private String make;
        private String model;
        private Integer year;
        private String color;
        private String licensePlate;

        public String getMake() { return make; }
        public void setMake(String make) { this.make = make; }

        public String getModel() { return model; }
        public void setModel(String model) { this.model = model; }

        public Integer getYear() { return year; }
        public void setYear(Integer year) { this.year = year; }

        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }

        public String getLicensePlate() { return licensePlate; }
        public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }
    }

    public static class LocationRequest {
        private String address;
        private String city;
        private String zipcode;
        private String area;

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public String getZipcode() { return zipcode; }
        public void setZipcode(String zipcode) { this.zipcode = zipcode; }

        public String getArea() { return area; }
        public void setArea(String area) { this.area = area; }
    }
}
