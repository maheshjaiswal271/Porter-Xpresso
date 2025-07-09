package com.porter.service;

import java.util.List;
import java.util.Map;

import com.porter.DTO.AdminStatisticsDTO;
import com.porter.model.Delivery;

public interface DeliveryService {
    Delivery createDelivery(Delivery delivery, String username);
    Delivery updatePaymentStatus(Long id,String paymentId, String username);
    List<Delivery> getUserDeliveries(String username);
    Delivery getDelivery(Long id, String username);
    Delivery cancelDelivery(Long id, String username);
    Map<String, Object> getDeliveryStats(String username);
    void deleteDelivery(Long id, String username);
    List<Delivery> getAllDeliveries();
    Delivery updateDelivery(Delivery delivery);
    void deleteDeliveryByAdmin(Long id);
    AdminStatisticsDTO getAdminStatistics();
    List<Delivery> getRecentDeliveries();
    List<Delivery> getDeliveriesByUser(Long id);
} 