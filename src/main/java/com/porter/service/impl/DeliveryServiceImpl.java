package com.porter.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.porter.DTO.AdminStatisticsDTO;
import com.porter.model.Delivery;
import com.porter.model.PaymentStatus;
import com.porter.model.User;
import com.porter.model.enums.DeliveryStatus;
import com.porter.repository.DeliveryRepository;
import com.porter.repository.PaymentRepository;
import com.porter.repository.PorterRepository;
import com.porter.repository.UserRepository;
import com.porter.service.DeliveryService;

@Service
public class DeliveryServiceImpl implements DeliveryService {
    private static final Logger logger = LoggerFactory.getLogger(DeliveryServiceImpl.class);

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PorterRepository porterRepository;

    @Override
    @Transactional
    public Delivery createDelivery(Delivery delivery, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AccessDeniedException("User not found"));
        
        delivery.setUser(user);
        delivery.setStatus(DeliveryStatus.PENDING); 
        delivery.setPaymentStatus(PaymentStatus.PENDING);
        
        // Set deliveryFee from amount if amount is provided
        if (delivery.getAmount() != null && delivery.getDeliveryFee() == null) {
            delivery.setDeliveryFee(delivery.getAmount());
        }
        
        // If amount is not provided but deliveryFee is, set amount from deliveryFee
        if (delivery.getAmount() == null && delivery.getDeliveryFee() != null) {
            delivery.setAmount(delivery.getDeliveryFee());
        }
        
        return deliveryRepository.save(delivery);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Delivery> getUserDeliveries(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AccessDeniedException("User not found"));
        
        return deliveryRepository.findByUserOrderByScheduledTimeDesc(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Delivery getDelivery(Long id, String username) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
        
        if (!delivery.getUser().getUsername().equals(username)) {
            throw new AccessDeniedException("Access denied");
        }
        
        return delivery;
    }

    @Transactional(readOnly = true)
    public Delivery getDeliveryById(Long id) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
        
        return delivery;
    }

    @Override
    @Transactional
    public Delivery cancelDelivery(Long id, String username) {
        try {
            Delivery delivery = getDelivery(id, username);
            
            if (delivery.getStatus() != DeliveryStatus.PENDING) {
                throw new IllegalStateException("Only pending deliveries can be cancelled");
            }
            
            delivery.setStatus(DeliveryStatus.CANCELLED);
            delivery.setUpdatedAt(LocalDateTime.now());
            
            logger.info("Cancelling delivery with ID: {}", id);
            return deliveryRepository.save(delivery);
        } catch (IllegalStateException e) {
            logger.error("Error cancelling delivery {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to cancel delivery: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public Delivery updatePaymentStatus(Long id, String paymentId, String username) {
        Delivery delivery = getDelivery(id, username);
        
        // Update delivery status to indicate payment is completed
        //delivery.setStatus(DeliveryStatus.ACCEPTED);
        delivery.setUpdatedAt(LocalDateTime.now());
        
        //logger.info("Updating payment status for delivery with ID: {} with payment ID: {}", id, paymentId);
        return deliveryRepository.save(delivery);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getDeliveryStats(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AccessDeniedException("User not found"));
        
        List<Delivery> userDeliveries = deliveryRepository.findByUserOrderByScheduledTimeDesc(user);
        
        Map<String, Object> stats = new HashMap<>();
        
        // Total counts
        stats.put("totalDeliveries", userDeliveries.size());
        stats.put("completedDeliveries", countByStatus(userDeliveries, DeliveryStatus.DELIVERED));
        stats.put("pendingDeliveries", countByStatus(userDeliveries, DeliveryStatus.PENDING));
        stats.put("cancelledDeliveries", countByStatus(userDeliveries, DeliveryStatus.CANCELLED));

        // Package type distribution
        Map<String, Long> packageTypeDistribution = userDeliveries.stream()
                .collect(Collectors.groupingBy(
                        delivery -> delivery.getPackageType().toString(),
                        Collectors.counting()
                ));
        stats.put("packageTypeDistribution", packageTypeDistribution);

        // Deliveries by date (last 7 days)
        List<Map<String, Object>> deliveriesByDate = new ArrayList<>();
        LocalDate today = LocalDate.now();
        
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            final LocalDate finalDate = date;
            
            long completed = userDeliveries.stream()
                    .filter(d -> isSameDay(d.getScheduledTime(), finalDate) && 
                            d.getStatus() == DeliveryStatus.DELIVERED)
                    .count();
            
            long pending = userDeliveries.stream()
                    .filter(d -> isSameDay(d.getScheduledTime(), finalDate) && 
                            (d.getStatus() == DeliveryStatus.PENDING ||
                             d.getStatus() == DeliveryStatus.ACCEPTED ||
                             d.getStatus() == DeliveryStatus.PICKED_UP ||
                             d.getStatus() == DeliveryStatus.IN_TRANSIT))
                    .count();
            
            long cancelled = userDeliveries.stream()
                    .filter(d -> isSameDay(d.getScheduledTime(), finalDate) && 
                            d.getStatus() == DeliveryStatus.CANCELLED)
                    .count();

            Map<String, Object> dayStats = new HashMap<>();
            dayStats.put("date", date);
            dayStats.put("completed", completed);
            dayStats.put("pending", pending);
            dayStats.put("cancelled", cancelled);
            
            deliveriesByDate.add(dayStats);
        }
        
        stats.put("deliveriesByDate", deliveriesByDate);
        
        return stats;
    }

    private long countByStatus(List<Delivery> deliveries, DeliveryStatus status) {
        return deliveries.stream()
                .filter(d -> d.getStatus() == status)
                .count();
    }

    private boolean isSameDay(LocalDateTime dateTime, LocalDate localDate) {
        if (dateTime == null) return false;
        return dateTime.toLocalDate().equals(localDate);
    }

    @Override
    @Transactional
    public void deleteDelivery(Long id, String username) {
        Delivery delivery = getDelivery(id, username);
        
        if (delivery.getStatus() != DeliveryStatus.CANCELLED) {
            throw new RuntimeException("Only cancelled deliveries can be deleted");
        }
        
        deliveryRepository.delete(delivery);
    }

    @Override
    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    @Override
    public Delivery updateDelivery(Delivery delivery) {
        return deliveryRepository.save(delivery);
    }

    @Override
    public void deleteDeliveryByAdmin(Long id) {
        deliveryRepository.deleteById(id);
    }

    @Override
    public AdminStatisticsDTO getAdminStatistics() {
        long totalUsers = userRepository.count();
        long totalPorters = porterRepository.count();
        long totalDeliveries = deliveryRepository.count();
        double totalRevenue = paymentRepository.findAll().stream().mapToDouble(p -> p.getAmount().doubleValue()).sum();
        long activeDeliveries = deliveryRepository.countByStatus(DeliveryStatus.ACCEPTED);
        long completedDeliveries = deliveryRepository.countByStatus(DeliveryStatus.DELIVERED);
        long cancelledDeliveries = deliveryRepository.countByStatus(DeliveryStatus.CANCELLED);
        return new AdminStatisticsDTO(totalUsers, totalPorters, totalDeliveries, totalRevenue, activeDeliveries, completedDeliveries, cancelledDeliveries);
    }

    @Override
    public List<Delivery> getRecentDeliveries() {
        return deliveryRepository.findTop10ByOrderByCreatedAtDesc();
    }

    @Override
    public List<Delivery> getDeliveriesByUser(Long id){
        List<Delivery> deliveries = deliveryRepository.findByUserId(id);
         return deliveries != null ? deliveries : new ArrayList<>();
    }

    @Transactional
    public void assignPorterAndAccept(Delivery delivery, String porterUsername) {
        var porter = porterRepository.findByName(porterUsername)
            .orElseThrow(() -> new AccessDeniedException("Porter not found"));
        delivery.setPorter(porter);
        delivery.setStatus(DeliveryStatus.ACCEPTED);
        delivery.setUpdatedAt(LocalDateTime.now());
        deliveryRepository.save(delivery);
    }
} 