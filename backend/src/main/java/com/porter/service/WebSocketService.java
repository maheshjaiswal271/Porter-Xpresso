package com.porter.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.porter.DTO.DeliveryDTO;
import com.porter.DTO.PorterDTO;
import com.porter.DTO.UserDTO;
import com.porter.model.Delivery;
import com.porter.model.Porter;
import com.porter.model.User;

@Service
public class WebSocketService {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    public void sendDeliveryUpdate(Delivery delivery) {
        DeliveryDTO deliveryDTO = DeliveryDTO.fromEntity(delivery);
        messagingTemplate.convertAndSend("/topic/deliveries", deliveryDTO);
        messagingTemplate.convertAndSend("/topic/admin", deliveryDTO);
        messagingTemplate.convertAndSend("/topic/porters", deliveryDTO);
    }
    
    public void sendUserUpdate(User user) {
        UserDTO userDTO = new UserDTO(user);
        messagingTemplate.convertAndSend("/topic/users", userDTO);
        messagingTemplate.convertAndSend("/topic/admin", userDTO);
    }
    
    public void sendPorterUpdate(Porter porter) {
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
        messagingTemplate.convertAndSend("/topic/porters", porterDTO);
        messagingTemplate.convertAndSend("/topic/admin", porterDTO);
    }
    
    public void sendAdminUpdate(Object data) {
        messagingTemplate.convertAndSend("/topic/admin", data);
    }

    public void sendNewDeliveryToPorters(Delivery delivery) {
        DeliveryDTO deliveryDTO = DeliveryDTO.fromEntity(delivery);
        messagingTemplate.convertAndSend("/topic/porters", deliveryDTO);
    }
} 