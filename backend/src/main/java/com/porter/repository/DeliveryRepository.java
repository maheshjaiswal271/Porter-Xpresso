package com.porter.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.porter.model.Delivery;
import com.porter.model.Porter;
import com.porter.model.User;
import com.porter.model.enums.DeliveryStatus;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    List<Delivery> findByUser(User user);

    List<Delivery> findByPorter(Porter porter);

    List<Delivery> findByStatus(DeliveryStatus status);

    List<Delivery> findByUserAndStatus(User user, DeliveryStatus status);

    List<Delivery> findByPorterAndStatus(Porter porter, DeliveryStatus status);

    List<Delivery> findByPorterAndStatusIn(Porter porter, List<DeliveryStatus> statuses);

    List<Delivery> findByUserOrderByScheduledTimeDesc(User user);

    List<Delivery> findByPorterOrderByScheduledTimeDesc(Porter porter);

    long countByStatus(DeliveryStatus status);

    List<Delivery> findTop10ByOrderByCreatedAtDesc();

    List<Delivery> findByUserId(Long userId);

}