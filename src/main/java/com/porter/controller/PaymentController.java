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
import com.porter.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

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
        return ResponseEntity.ok(response);
    }
} 