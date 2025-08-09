package com.porter.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.porter.DTO.DeliveryDTO;
import com.porter.model.Delivery;
import com.porter.model.Tracking;
import com.porter.model.enums.DeliveryStatus;
import com.porter.service.PorterService;
import com.porter.service.TrackingService;
import com.porter.service.impl.DeliveryServiceImpl;

@CrossOrigin(origins = "${FRONTEND_URL}")
@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {
    private static final Logger logger = LoggerFactory.getLogger(DeliveryController.class);

    @Autowired
    private DeliveryServiceImpl deliveryService;

    @Autowired
    private TrackingService trackingService;

    @Autowired
    private com.porter.Email.EmailService emailService;

    @Autowired
    private PorterService porterService;

    @PostMapping("/delivery")
    public ResponseEntity<DeliveryDTO> createDelivery(@RequestBody Delivery delivery, Authentication authentication) {
        String username = authentication.getName();
        Delivery createdDelivery = deliveryService.createDelivery(delivery, username);
        // Send confirmation email
        emailService.sendDeliveryBookedEmail(createdDelivery);
        return ResponseEntity.ok(DeliveryDTO.fromEntity(createdDelivery));
    }

    @GetMapping
    public ResponseEntity<List<DeliveryDTO>> getUserDeliveries(Authentication authentication) {
        String username = authentication.getName();
        List<Delivery> deliveries = deliveryService.getUserDeliveries(username);
        List<DeliveryDTO> deliveryDTOs = deliveries.stream()
                .map(DeliveryDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(deliveryDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliveryDTO> getDelivery(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        Delivery delivery = deliveryService.getDelivery(id, username);
        return ResponseEntity.ok(DeliveryDTO.fromEntity(delivery));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelDelivery(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            logger.info("Attempting to cancel delivery {} for user {}", id, username);
            
            Delivery delivery = deliveryService.cancelDelivery(id, username);
            
            logger.info("Successfully cancelled delivery {}", id);
            return ResponseEntity.ok(DeliveryDTO.fromEntity(delivery));
            
        } catch (IllegalStateException e) {
            logger.warn("Invalid state for cancelling delivery {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
                    
        } catch (AccessDeniedException e) {
            logger.warn("Access denied for cancelling delivery {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Access denied"));
                    
        } catch (Exception e) {
            logger.error("Error cancelling delivery {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to cancel delivery: " + e.getMessage()));
        }
    }

    @PutMapping("/delivery/{id}/payment")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable Long id, @RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String username = authentication.getName();
            String paymentId = request.get("paymentId");
            
            if (paymentId == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Payment ID is required"));
            }
            
            logger.info("Updating payment status for delivery {} with payment ID {}", id, paymentId);
            
            Delivery delivery = deliveryService.updatePaymentStatus(id, paymentId, username);
            
            logger.info("Successfully updated payment status for delivery {}", id);
            return ResponseEntity.ok(DeliveryDTO.fromEntity(delivery));
            
        } catch (AccessDeniedException e) {
            logger.warn("Access denied for updating payment status for delivery {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Access denied"));
                    
        } catch (Exception e) {
            logger.error("Error updating payment status for delivery {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to update payment status: " + e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDeliveryStats(Authentication authentication) {
        String username = authentication.getName();
        Map<String, Object> stats = deliveryService.getDeliveryStats(username);
        return ResponseEntity.ok(stats);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDelivery(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            deliveryService.deleteDelivery(id, username);
        } catch (Exception ex) {
            throw new RuntimeException("Cannot Delete Delivery");
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("{id}/status")
    public ResponseEntity<?> updateDeliveryStatusWithTracking(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request,
            Authentication authentication) {
        try {
            Delivery delivery = deliveryService.getDeliveryById(id);
            if (request.getStatus().equals("ACCEPTED") && delivery.getPorter() == null) {
                String username = authentication.getName();
                deliveryService.assignPorterAndAccept(delivery, username);
            } else {
                delivery.setStatus(DeliveryStatus.valueOf(request.getStatus()));
                delivery.setUpdatedAt(LocalDateTime.now());
                deliveryService.updateDelivery(delivery);
            }
            Tracking tracking = new Tracking();
            tracking.setDelivery(delivery);
            tracking.setStatus(delivery.getStatus());
            tracking.setTimestamp(LocalDateTime.now());
            tracking.setLatitude(request.getLatitude());
            tracking.setLongitude(request.getLongitude());
            trackingService.addTracking(tracking);
            emailService.sendDeliveryStatusEmail(delivery, delivery.getStatus().name());
            if (delivery.getStatus() == DeliveryStatus.DELIVERED &&
                delivery.getPaymentStatus() != com.porter.model.PaymentStatus.COMPLETED) {
                emailService.sendUnpaidBillEmail(delivery, delivery.getAmount() != null ? delivery.getAmount().toString() : "");
            }
            return ResponseEntity.ok(DeliveryDTO.fromEntity(delivery));
        } catch (Exception ex) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", ex.getMessage()));
        }
    }

    @PostMapping("/rate-porter")
    public ResponseEntity<?> ratePorter(@RequestBody Map<String, Object> payload) {
        Long porterId = ((Number) payload.get("porterId")).longValue();
        Double rating = ((Number) payload.get("rating")).doubleValue();
        porterService.ratePorter(porterId, rating);
        return ResponseEntity.ok(Map.of("message", "Rating submitted successfully"));
    }

   public static class StatusUpdateRequest {
        private String status;
        private Double latitude;
        private Double longitude;
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public Double getLatitude() { return latitude; }
        public void setLatitude(Double latitude) { this.latitude = latitude; }
        public Double getLongitude() { return longitude; }
        public void setLongitude(Double longitude) { this.longitude = longitude; }
    }
}