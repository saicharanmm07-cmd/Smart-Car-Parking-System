package com.carparking.parking_system.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "booking_addons")
public class BookingAddon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;
    @ManyToOne
    @JoinColumn(name = "addon_id", nullable = false)
    private Addon addon;
    private BigDecimal price;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }
    public Addon getAddon() { return addon; }
    public void setAddon(Addon addon) { this.addon = addon; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}
