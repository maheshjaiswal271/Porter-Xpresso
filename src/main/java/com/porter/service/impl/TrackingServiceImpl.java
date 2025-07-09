package com.porter.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.porter.model.Delivery;
import com.porter.model.Tracking;
import com.porter.repository.DeliveryRepository;
import com.porter.repository.TrackingRepository;
import com.porter.service.TrackingService;

@Service
public class TrackingServiceImpl implements TrackingService {
    @Autowired
    private TrackingRepository trackingRepository;
    @Autowired
    private DeliveryRepository deliveryRepository;

    @Override
    public List<Tracking> getTrackingByDeliveryId(Long deliveryId) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
        return trackingRepository.findByDelivery(delivery);
    }

    @Override
    public void addTracking(Tracking tracking) {
        trackingRepository.save(tracking);
    }
} 