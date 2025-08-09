package com.porter.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.porter.model.Delivery;
import com.porter.model.Payment;
import com.porter.model.PaymentStatus;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByDelivery(Delivery delivery);
    Optional<Payment> findByDeliveryAndStatus(Delivery delivery, PaymentStatus status);
    List<Payment> findByStatus(PaymentStatus status);
    Optional<Payment> findByPaymentId(String paymentId);
    @Query("SELECT p FROM Payment p JOIN FETCH p.delivery d JOIN FETCH d.user WHERE p.paymentId = :paymentId")
    Optional<Payment> findByPaymentIdWithDeliveryAndUser(@Param("paymentId") String paymentId);
    @Modifying
    @Query("DELETE FROM Payment p where p.delivery.id = :deliveryId")
    void deletePaymentByDeliveryId(@Param("deliveryId") Long deliveryId);
} 