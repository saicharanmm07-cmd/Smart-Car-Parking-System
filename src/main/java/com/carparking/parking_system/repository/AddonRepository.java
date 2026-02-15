package com.carparking.parking_system.repository;

import com.carparking.parking_system.entity.Addon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddonRepository extends JpaRepository<Addon, Long> {
}
