package com.porter.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.porter.DTO.PaymentResponse;
import com.porter.DTO.RazorpayOrderRequest;
import com.porter.DTO.RazorpayOrderResponse;
import com.porter.model.Delivery;
import com.porter.model.Payment;
import com.porter.model.PaymentStatus;
import com.porter.repository.DeliveryRepository;
import com.porter.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;

import jakarta.transaction.Transactional;

@Service
public class PaymentService {

    @Autowired
    private RazorpayClient razorpayClient;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Value("${razorpay.currency}")
    private String currency;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.company.name}")
    private String companyName;

    public RazorpayOrderResponse createOrder(RazorpayOrderRequest request) {
        try {
            Delivery delivery = deliveryRepository.findById(request.getDeliveryId())
                    .orElseThrow(() -> new RuntimeException("Delivery not found"));

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", request.getAmount().multiply(new BigDecimal("100")).intValue());
            orderRequest.put("currency", currency);
            orderRequest.put("receipt", "order_" + delivery.getId());

            Order order = razorpayClient.orders.create(orderRequest);

            // Create a payment record
            Payment payment = new Payment();
            payment.setDelivery(delivery);
            payment.setAmount(request.getAmount());
            payment.setStatus(PaymentStatus.PENDING);
            payment.setPaymentId(order.get("id"));
            payment.setCurrency(currency);
            payment.setCreatedAt(LocalDateTime.now());
            payment.setPaymentMethod("razorpay");
            paymentRepository.save(payment);

            RazorpayOrderResponse response = new RazorpayOrderResponse();
            response.setOrderId(order.get("id"));
            response.setCurrency(order.get("currency"));
            response.setAmount(((Number) order.get("amount")).intValue());
            response.setReceipt(order.get("receipt"));
            response.setStatus(order.get("status"));
            response.setKeyId(razorpayKeyId);
            response.setCompanyName(companyName);
            return response;

        } catch (RazorpayException e) {
            throw new RuntimeException("Error creating Razorpay order: " + e.getMessage());
        }
    }

    public PaymentResponse verifyAndUpdatePayment(String razorpayPaymentId, String razorpayOrderId,
            String razorpaySignature) {
        Payment payment = null;
        Delivery delivery = null;
        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_payment_id", razorpayPaymentId);
            attributes.put("razorpay_order_id", razorpayOrderId);
            attributes.put("razorpay_signature", razorpaySignature);

            Utils.verifyPaymentSignature(attributes, razorpayKeyId);

            payment = paymentRepository.findByPaymentId(razorpayOrderId)
                    .orElseThrow(() -> new RuntimeException("Payment not found"));

            Long deliveryId = payment.getDelivery() != null ? payment.getDelivery().getId() : null;

            if (deliveryId == null) {
                throw new RuntimeException("Delivery ID not found in payment");
            }

            delivery = deliveryRepository.findById(deliveryId)
                    .orElseThrow(() -> new RuntimeException("Associated delivery not found"));

            payment.setStatus(PaymentStatus.COMPLETED);
            paymentRepository.save(payment);

            delivery.setPaymentStatus(PaymentStatus.COMPLETED);
            deliveryRepository.save(delivery);

            PaymentResponse response = new PaymentResponse();
            response.setSuccess(true);
            response.setPaymentId(razorpayPaymentId);
            response.setMessage("Payment verified and completed successfully");
            return response;

        } catch (RazorpayException | RuntimeException e) {
            if (delivery == null && payment != null) {
                delivery = payment.getDelivery();
            }
            if (delivery != null) {
                delivery.setPaymentStatus(PaymentStatus.FAILED);
                deliveryRepository.save(delivery);
            }
            throw new RuntimeException("Error verifying payment: " + e.getMessage());
        }
    }

    public Payment findByPaymentId(String paymentId) {
        return paymentRepository.findByPaymentIdWithDeliveryAndUser(paymentId).orElse(null);
    }

    @Transactional  
    public void deletePaymentByDeliveryId(Long deliveryId){
        paymentRepository.deletePaymentByDeliveryId(deliveryId);
    }
}