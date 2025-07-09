package com.porter.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.porter.DTO.DeliveryDTO;
import com.porter.DTO.TrackingDTO;
import com.porter.model.Tracking;
import com.porter.service.TrackingService;

@RestController
@RequestMapping("/api/tracking")
public class TrackingController {
    @Autowired
    private TrackingService trackingService;

    @GetMapping("/{deliveryId}")
    public ResponseEntity<?> getTrackingByDeliveryId(@PathVariable Long deliveryId) {
        List<Tracking> trackingList = trackingService.getTrackingByDeliveryId(deliveryId);
        List<TrackingDTO> dtoList = trackingList.stream().map(t -> {
            var d = t.getDelivery();
            return new TrackingDTO(
                t.getId(),
                d.getId(),
                t.getLatitude(),
                t.getLongitude(),
                t.getStatus(),
                t.getCreatedAt(),
                t.getUpdatedAt(),
                t.getTimestamp(),
                DeliveryDTO.fromEntity(d)
            );
        }).toList();
        DeliveryDTO deliveryDTO = trackingList.isEmpty() ? null : DeliveryDTO.fromEntity(trackingList.get(0).getDelivery());
        return ResponseEntity.ok(
            java.util.Map.of(
                "delivery", deliveryDTO,
                "tracking", dtoList
            )
        );
    }
}
