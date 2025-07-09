package com.porter.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
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
} 