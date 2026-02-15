package com.carparking.parking_system.repository;

import com.carparking.parking_system.entity.PointsHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PointsHistoryRepository extends JpaRepository<PointsHistory, Long> {
    List<PointsHistory> findByUserId(Long userId);
}
