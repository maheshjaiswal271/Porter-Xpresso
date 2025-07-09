package com.porter.service;

import java.util.List;
import java.util.Map;

import com.porter.DTO.DeliveryDTO;
import com.porter.model.enums.DeliveryStatus;

public interface PorterService {
    List<DeliveryDTO> getAvailableDeliveries();
    DeliveryDTO acceptDelivery(Long deliveryId, String porterUsername);
    DeliveryDTO updateDeliveryStatus(Long deliveryId, DeliveryStatus newStatus, String porterUsername);
    List<DeliveryDTO> getActiveDeliveries(String porterUsername);
    List<DeliveryDTO> getDeliveryHistory(String porterUsername);
    Map<String, Object> getPorterStats(String porterUsername);
} 