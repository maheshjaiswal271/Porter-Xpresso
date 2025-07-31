package com.porter.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.porter.DTO.PaymentResponse;
import com.porter.DTO.RazorpayOrderRequest;
import com.porter.DTO.RazorpayOrderResponse;
import com.porter.Email.EmailService;
import com.porter.model.Delivery;
import com.porter.model.Payment;
import com.porter.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "${FRONTEND_URL}")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/create-order")
    public ResponseEntity<RazorpayOrderResponse> createOrder(@RequestBody RazorpayOrderRequest request) {
        RazorpayOrderResponse response = paymentService.createOrder(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<PaymentResponse> verifyPayment(
            @RequestHeader("X-Razorpay-Payment-ID") String razorpayPaymentId,
            @RequestHeader("X-Razorpay-Order-ID") String razorpayOrderId,
            @RequestHeader("X-Razorpay-Signature") String razorpaySignature) {
        PaymentResponse response = paymentService.verifyAndUpdatePayment(
            razorpayPaymentId, razorpayOrderId, razorpaySignature);
        if (response != null && response.isSuccess()) {
            Payment payment = paymentService.findByPaymentId(razorpayOrderId);
            if (payment != null) {
                Delivery delivery = payment.getDelivery();
                if (delivery != null && delivery.getUser() != null) {
                    emailService.sendInvoiceEmail(
                        delivery,
                        payment.getAmount() != null ? payment.getAmount().toString() : "",
                        payment.getPaymentMethod()
                    );
                }
            }
        }
        return ResponseEntity.ok(response);
    }
} 