package com.porter.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.porter.DTO.AdminStatisticsDTO;
import com.porter.DTO.DeliveryDTO;
import com.porter.DTO.UserDTO;
import com.porter.Email.EmailService;
import com.porter.model.Delivery;
import com.porter.model.Porter;
import com.porter.model.User;
import com.porter.repository.PorterRepository;
import com.porter.repository.UserRepository;
import com.porter.service.DeliveryService;
import com.porter.service.PaymentService;
import com.porter.service.UserService;

@CrossOrigin(origins = "${FRONTEND_URL}")
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    @Autowired
    private UserService userService;
    @Autowired
    private DeliveryService deliveryService;
    @Autowired
    private PorterRepository porterRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private EmailService emailService;
    @Autowired
    private PaymentService paymentService;

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    // User Management
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers().stream().map(UserDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PostMapping("/users")
    public ResponseEntity<UserDTO> createUser(@RequestBody User user) {
        User created = userService.createUser(user);
        return ResponseEntity.ok(new UserDTO(created));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        User updated = userService.updateUser(user);
        return ResponseEntity.ok(new UserDTO(updated));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        List<Delivery> deliveries = deliveryService.getDeliveriesByUser(id);
        if (deliveries != null && !deliveries.isEmpty()) {
            throw new RuntimeException("User cannot be deleted because they have existing deliveries.");
        }
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    private void sendBlockUnblockEmail(String email, String name, String role, boolean blocked) {
        String status = blocked ? "Blocked" : "Unblocked";
        String statusColor = blocked ? "#dc3545" : "#28a745";
        String iconUrl = blocked ? "https://img.icons8.com/emoji/48/no-entry.png" : "https://img.icons8.com/emoji/48/check-mark-emoji.png";
        String subject;
        if ("PORTER".equals(role)) {
            subject = "Porter Account " + status + " Notification";
        } else {
            subject = "Account " + status + " Notification";
        }
        String mainText;
        if (blocked) {
            mainText = ("PORTER".equals(role))
                ? "Your porter account has been <span style='color: " + statusColor + ";'><strong>blocked</strong></span> by the admin. You will not be able to access your account until it is unblocked."
                : "Your account has been <span style='color: " + statusColor + ";'><strong>blocked</strong></span> by the admin. You will not be able to access your account until it is unblocked.";
        } else {
            mainText = ("PORTER".equals(role))
                ? "Your porter account has been <span style='color: " + statusColor + ";'><strong>unblocked</strong></span> by the admin. You can now log in and use your account as usual."
                : "Your account has been <span style='color: " + statusColor + ";'><strong>unblocked</strong></span> by the admin. You can now log in and use your account as usual.";
        }
        String content = String.format(
            "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);'>"
            + "<div style='text-align: center;'>"
            + "<img src='%s' alt='%s' width='50' height='50' />"
            + "<h2 style='color: %s; margin-bottom: 10px;'>%s Account %s</h2>"
            + "</div>"
            + "<p style='font-size: 16px; color: #333;'>Dear <strong>%s</strong>,</p>"
            + "<p style='font-size: 15px; color: #555;'>%s</p>"
            + "<p style='font-size: 14px; color: #666;'>If you have any questions, please contact support.</p>"
            + "<p style='font-size: 14px; color: #333; margin-top: 30px;'>Best regards,<br><strong>Porter Team</strong></p>"
            + "</div>",
            iconUrl, status, statusColor, ("PORTER".equals(role) ? "Porter" : "User"), status, name, mainText
        );
        emailService.sendEmail(email, subject, content);
    }

    @PutMapping("/users/{id}/block")
    public ResponseEntity<?> blockUser(@PathVariable Long id) {
        boolean result = userService.blockUser(id);
        if (result) {
            userRepository.findById(id).ifPresent(user -> {
                sendBlockUnblockEmail(user.getEmail(), user.getUsername(), user.getRole().name(), true);
                if ("PORTER".equals(user.getRole().name())) {
                    porterRepository.findByEmail(user.getEmail()).ifPresent(porter -> {
                        sendBlockUnblockEmail(porter.getEmail(), porter.getName(), "PORTER", true);
                    });
                }
            });
            return ResponseEntity.ok(Map.of("message", "User blocked successfully"));
        } else {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }
    }

    @PutMapping("/users/{id}/unblock")
    public ResponseEntity<?> unblockUser(@PathVariable Long id) {
        boolean result = userService.unblockUser(id);
        if (result) {
            userRepository.findById(id).ifPresent(user -> {
                sendBlockUnblockEmail(user.getEmail(), user.getUsername(), user.getRole().name(), false);
                if ("PORTER".equals(user.getRole().name())) {
                    porterRepository.findByEmail(user.getEmail()).ifPresent(porter -> {
                        sendBlockUnblockEmail(porter.getEmail(), porter.getName(), "PORTER", false);
                    });
                }
            });
            return ResponseEntity.ok(Map.of("message", "User unblocked successfully"));
        } else {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }
    }

    // Delivery Management
    @GetMapping("/deliveries")
    public ResponseEntity<List<DeliveryDTO>> getAllDeliveries() {
        List<DeliveryDTO> deliveries = deliveryService.getAllDeliveries().stream().map(DeliveryDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(deliveries);
    }

    @PutMapping("/deliveries/{id}")
    public ResponseEntity<DeliveryDTO> updateDelivery(@PathVariable Long id, @RequestBody Delivery delivery) {
        delivery.setId(id);
        Delivery updated = deliveryService.updateDelivery(delivery);
        return ResponseEntity.ok(DeliveryDTO.fromEntity(updated));
    }

    @DeleteMapping("/deliveries/{id}")
    public ResponseEntity<Void> deleteDelivery(@PathVariable Long id) {
        Delivery delivery = deliveryService.getDeliveryById(id);
        if(delivery != null){
            paymentService.deletePaymentByDeliveryId(id);
            deliveryService.deleteDelivery(id, delivery.getUser().getUsername());
        }
        return ResponseEntity.ok().build();
    }

    // Get 10 most recent deliveries
    @GetMapping("/deliveries/recent")
    public ResponseEntity<List<DeliveryDTO>> getRecentDeliveries() {
        List<Delivery> deliveries = deliveryService.getRecentDeliveries();
        List<DeliveryDTO> deliveryDTOs = deliveries.stream().map(DeliveryDTO::fromEntity).collect(Collectors.toList());
        return ResponseEntity.ok(deliveryDTOs);
    }

    // Get all unapproved porters
    @GetMapping("/porters/pending")
    public ResponseEntity<List<Porter>> getPendingPorters() {
        List<Porter> pendingPorters = porterRepository.findAllByStatus("PENDING");
        return ResponseEntity.ok(pendingPorters);
    }

    // Statistics
    @GetMapping("/statistics")
    public ResponseEntity<AdminStatisticsDTO> getStatistics() {
        AdminStatisticsDTO stats = deliveryService.getAdminStatistics();
        return ResponseEntity.ok(stats);
    }

    // Porter Approval
    @PutMapping("/porters/{id}/approve")
    public ResponseEntity<?> approvePorter(@PathVariable Long id) {
        Porter porter = porterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Porter not found"));
        porter.setStatus("APPROVED");
        porterRepository.save(porter);

        String subject = "Porter Approval Notification";
        String content = String.format(
                """
                                                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                                                    <div style="text-align: center;">
                                                         <img src="https://img.icons8.com/emoji/48/delivery-truck.png" alt="Delivery Truck" width="50" height="50" />
                                                        <h2 style="color: #007bff; margin-bottom: 10px;">Porter Application Approved</h2>
                                                    </div>

                                                    <p style="font-size: 16px; color: #333;">Dear <strong>%s</strong>,</p>

                                                    <p style="font-size: 15px; color: #555;">
                                                       <img src="https://img.icons8.com/emoji/24/party-popper.png" alt="Celebration" width="24" height="24" style="vertical-align: middle; margin-right: 6px;" />
                        <strong>Congratulations!</strong>
                         Your application as a <strong>Porter</strong> has been <span style="color: green;"><strong>APPROVED</strong></span>.
                                                    </p>

                                                    <p style="font-size: 15px; color: #555;">
                                                        You can now log in to your account and start accepting deliveries using the Porter system.
                                                    </p>

                                                   <div style="text-align: center; margin: 30px 0;">
                            <a href="%s/login"
                               style="background-color: #007bff; color: white; padding: 14px 28px; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 8px; display: inline-block;">
                                <img src="https://img.icons8.com/ios-filled/20/ffffff/key.png"
                                     alt="Key Icon"
                                     style="vertical-align: middle; margin-right: 8px;" />
                                Login Now
                            </a>
                        </div>


                                                    <p style="font-size: 14px; color: #666;">
                                                        If you have any questions or need help, feel free to contact our support team.
                                                    </p>

                                                    <p style="font-size: 14px; color: #333; margin-top: 30px;">
                                                        Best regards,<br>
                                                        <strong>Porter Team</strong>
                                                    </p>
                                                </div>
                                                """,
                porter.getName(), frontendUrl);

        emailService.sendEmail(porter.getEmail(), subject, content);
        return ResponseEntity.ok().body("Porter approved successfully");
    }

    // Edit porter
    @PutMapping("/porters/{id}")
    public ResponseEntity<?> editPorter(@PathVariable Long id, @RequestBody Porter update) {
        Porter porter = porterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Porter not found"));
        porter.setName(update.getName());
        porter.setPhone(update.getPhone());
        porter.setVehicleType(update.getVehicleType());
        porter.setLicenseNumber(update.getLicenseNumber());
        porterRepository.save(porter);
        return ResponseEntity.ok(porter);
    }

    // Reset user/porter password (admin)
    @PostMapping("/users/{id}/reset-password")
    public ResponseEntity<?> resetPassword(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newPassword = body.get("newPassword");
        if (newPassword == null || newPassword.length() < 6)
            throw new RuntimeException("Password must be at least 6 characters");
        var user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return ResponseEntity.ok("Password reset successfully");
    }
}