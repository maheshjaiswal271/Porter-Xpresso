package com.porter.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.porter.model.Delivery;
import com.porter.model.Tracking;

@Repository
public interface TrackingRepository extends JpaRepository<Tracking, Long> {
    List<Tracking> findByDelivery(Delivery delivery);
    // List<Tracking> findByDeliveryOrderByTimestampDesc(Delivery delivery);
    // Tracking findFirstByDeliveryOrderByTimestampDesc(Delivery delivery);
} 