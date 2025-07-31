package com.porter.service.impl;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.porter.DTO.DeliveryDTO;
import com.porter.model.Delivery;
import com.porter.model.Porter;
import com.porter.model.enums.DeliveryStatus;
import com.porter.repository.DeliveryRepository;
import com.porter.repository.PorterRepository;
import com.porter.service.PorterService;
import com.porter.service.WebSocketService;

@Service
public class PorterServiceImpl implements PorterService {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private PorterRepository porterRepository;

    @Autowired
    private WebSocketService webSocketService;

    @Override
    @Transactional(readOnly = true)
    public List<DeliveryDTO> getAvailableDeliveries() {
        List<Delivery> availableDeliveries = deliveryRepository.findByStatus(DeliveryStatus.PENDING);
        return availableDeliveries.stream()
                .map(DeliveryDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DeliveryDTO acceptDelivery(Long deliveryId, String porterUsername) {
        Porter porter = porterRepository.findByName(porterUsername)
                .orElseThrow(() -> new AccessDeniedException("Porter not found"));

        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        if (delivery.getStatus() != DeliveryStatus.PENDING) {
            throw new IllegalStateException("Delivery is not available for acceptance");
        }

        delivery.setPorter(porter);
        delivery.setStatus(DeliveryStatus.ACCEPTED);
        delivery.setUpdatedAt(LocalDateTime.now());

        Delivery savedDelivery = deliveryRepository.save(delivery);
        webSocketService.sendDeliveryUpdate(savedDelivery);
        return DeliveryDTO.fromEntity(savedDelivery);
    }

    @Override
    @Transactional
    public DeliveryDTO updateDeliveryStatus(Long deliveryId, DeliveryStatus newStatus, String porterUsername) {
        Porter porter = porterRepository.findByName(porterUsername)
                .orElseThrow(() -> new AccessDeniedException("Porter not found"));

        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        if (!delivery.getPorter().getId().equals(porter.getId())) {
            throw new AccessDeniedException("Not authorized to update this delivery");
        }

        validateStatusTransition(delivery.getStatus(), newStatus);

        delivery.setStatus(newStatus);
        delivery.setUpdatedAt(LocalDateTime.now());

        Delivery savedDelivery = deliveryRepository.save(delivery);
        webSocketService.sendDeliveryUpdate(savedDelivery);
        return DeliveryDTO.fromEntity(savedDelivery);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeliveryDTO> getActiveDeliveries(String porterUsername) {
        Porter porter = porterRepository.findByName(porterUsername)
                .orElseThrow(() -> new AccessDeniedException("Porter not found"));

        List<DeliveryStatus> activeStatuses = List.of(
                DeliveryStatus.ACCEPTED,
                DeliveryStatus.PICKED_UP,
                DeliveryStatus.IN_TRANSIT
        );

        List<Delivery> activeDeliveries = deliveryRepository.findByPorterAndStatusIn(porter, activeStatuses);
        return activeDeliveries.stream()
                .map(DeliveryDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeliveryDTO> getDeliveryHistory(String porterUsername) {
        Porter porter = porterRepository.findByName(porterUsername)
                .orElseThrow(() -> new AccessDeniedException("Porter not found"));

        List<DeliveryStatus> completedStatuses = List.of(
                DeliveryStatus.DELIVERED,
                DeliveryStatus.CANCELLED
        );

        List<Delivery> deliveryHistory = deliveryRepository.findByPorterAndStatusIn(porter, completedStatuses);
        return deliveryHistory.stream()
                .map(DeliveryDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getPorterStats(String porterUsername) {
        Porter porter = porterRepository.findByName(porterUsername)
                .orElseThrow(() -> new AccessDeniedException("Porter not found"));

        List<Delivery> allDeliveries = deliveryRepository.findByPorterAndStatusIn(porter, 
            List.of(DeliveryStatus.ACCEPTED, DeliveryStatus.PICKED_UP, DeliveryStatus.IN_TRANSIT, 
                   DeliveryStatus.DELIVERED, DeliveryStatus.CANCELLED));
        List<Delivery> delivered = allDeliveries.stream()
                .filter(d -> d.getStatus() == DeliveryStatus.DELIVERED)
                .collect(Collectors.toList());

        // Calculate statistics
        long completedDeliveries = delivered.size();

        long pendingDeliveries = allDeliveries.stream()
                                .filter(x -> x.getStatus() == DeliveryStatus.ACCEPTED || x.getStatus() == DeliveryStatus.PICKED_UP || x.getStatus() == DeliveryStatus.IN_TRANSIT)
                                .count();

        double totalEarnings = delivered.stream()
                .mapToDouble(d -> d.getDeliveryFee().doubleValue())
                .sum();

        // Calculate on-time delivery rate
        long onTimeDeliveries = delivered.stream()
                .filter(d -> {
                    LocalDateTime scheduledTime = d.getScheduledTime();
                    if (scheduledTime == null) {
                        scheduledTime = d.getCreatedAt().plusHours(2);
                    }
                    return !d.getUpdatedAt().isAfter(scheduledTime);
                })
                .count();
        double onTimeRate = completedDeliveries > 0 
                ? (double) onTimeDeliveries / completedDeliveries 
                : 0.0;

        // Earnings by day
        Map<String, Double> earningsByDayMap = new HashMap<>();
        for (Delivery d : delivered) {
            String date = d.getUpdatedAt().toLocalDate().toString();
            earningsByDayMap.put(date, earningsByDayMap.getOrDefault(date, 0.0) + d.getDeliveryFee().doubleValue());
        }
        List<Map<String, Object>> earningsByDay = earningsByDayMap.entrySet().stream()
                .map(e -> Map.<String, Object>of("date", e.getKey(), "amount", e.getValue()))
                .sorted((a, b) -> ((String)a.get("date")).compareTo((String)b.get("date")))
                .collect(Collectors.toList());

        // Deliveries by type
        Map<String, Long> deliveriesByType = delivered.stream()
                .collect(Collectors.groupingBy(
                        d -> d.getPackageType().toString(), Collectors.counting()
                ));

        // Average rating (placeholder)
        double averageRating = 5.0;

        Map<String, Long> packageTypeDistribution = delivered.stream()
                .collect(Collectors.groupingBy(
                        delivery -> delivery.getPackageType().toString(),
                        Collectors.counting()
                ));

        return Map.of(
            "totalDeliveries", allDeliveries.size(),
            "completedDeliveries", completedDeliveries,
            "totalEarnings", totalEarnings,
            "onTimeRate", onTimeRate,
            "averageRating", averageRating,
            "earningsByDay", earningsByDay,
            "deliveriesByType", deliveriesByType,
            "pendingDeliveries", pendingDeliveries,
            "packageTypeDistribution", packageTypeDistribution
        );
    }

    @Override
    @Transactional
    public void ratePorter(Long porterId, double rating) {
        Porter porter = porterRepository.findById(porterId)
                .orElseThrow(() -> new RuntimeException("Porter not found"));
        porter.setRating(rating); // Overwrite for now; can be changed to average later
        porterRepository.save(porter);
    }

    private void validateStatusTransition(DeliveryStatus currentStatus, DeliveryStatus newStatus) {
        boolean isValidTransition = switch (currentStatus) {
            case ACCEPTED -> newStatus == DeliveryStatus.PICKED_UP;
            case PICKED_UP -> newStatus == DeliveryStatus.IN_TRANSIT;
            case IN_TRANSIT -> newStatus == DeliveryStatus.DELIVERED;
            default -> false;
        };

        if (!isValidTransition) {
            throw new IllegalStateException(
                    String.format("Invalid status transition from %s to %s", currentStatus, newStatus));
        }
    }
} 