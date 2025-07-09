package com.porter.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.porter.DTO.DeliveryDTO;
import com.porter.DTO.PorterDTO;
import com.porter.model.Porter;
import com.porter.repository.PorterRepository;
import com.porter.service.PorterService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/porter")
@PreAuthorize("hasRole('PORTER')")
public class PorterController {

    @Autowired
    private PorterService porterService;

    @Autowired
    private PorterRepository porterRepository;

    @GetMapping("/profile")
    public ResponseEntity<PorterDTO> getPorterProfile(Authentication authentication) {
        String username = authentication.getName();
        Porter porter = porterRepository.findByName(username)
                .orElseThrow(() -> new RuntimeException("Porter not found"));
        
        PorterDTO porterDTO = new PorterDTO(
            porter.getId(),
            porter.getName(),
            porter.getEmail(),
            porter.getPhone(),
            porter.getStatus(),
            porter.getVehicleType(),
            porter.getLicenseNumber(),
            porter.getRating(),
            porter.getCreatedAt(),
            porter.getUpdatedAt()
        );
        
        return ResponseEntity.ok(porterDTO);
    }

    @GetMapping("/available-deliveries")
    public ResponseEntity<List<DeliveryDTO>> getAvailableDeliveries() {
        List<DeliveryDTO> availableDeliveries = porterService.getAvailableDeliveries();
        return ResponseEntity.ok(availableDeliveries);
    }

    @GetMapping("/active-deliveries")
    public ResponseEntity<List<DeliveryDTO>> getActiveDeliveries(Authentication authentication) {
        String username = authentication.getName();
        List<DeliveryDTO> activeDeliveries = porterService.getActiveDeliveries(username);
        return ResponseEntity.ok(activeDeliveries);
    }

    @GetMapping("/delivery-history")
    public ResponseEntity<List<DeliveryDTO>> getDeliveryHistory(Authentication authentication) {
        String username = authentication.getName();
        List<DeliveryDTO> deliveryHistory = porterService.getDeliveryHistory(username);
        return ResponseEntity.ok(deliveryHistory);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getPorterStats(Authentication authentication) {
        String username = authentication.getName();
        Map<String, Object> stats = porterService.getPorterStats(username);
        return ResponseEntity.ok(stats);
    }
}