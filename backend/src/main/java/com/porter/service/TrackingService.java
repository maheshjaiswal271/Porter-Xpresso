package com.porter.service;

import com.porter.model.Tracking;
import java.util.List;

public interface TrackingService {
    List<Tracking> getTrackingByDeliveryId(Long deliveryId);
    void addTracking(Tracking tracking);
} 