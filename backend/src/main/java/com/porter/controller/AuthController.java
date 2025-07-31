package com.porter.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.porter.DTO.AuthResponse;
import com.porter.DTO.ChangePasswordRequest;
import com.porter.DTO.ForgetPasswordRequest;
import com.porter.DTO.LoginRequest;
import com.porter.DTO.OtpVerificationRequest;
import com.porter.DTO.RegisterRequest;
import com.porter.DTO.UserDTO;
import com.porter.Email.EmailService;
import com.porter.model.Porter;
import com.porter.model.User;
import com.porter.model.enums.UserRole;
import com.porter.repository.PorterRepository;
import com.porter.repository.UserRepository;
import com.porter.security.JwtTokenProvider;
import com.porter.service.OtpService;
import com.porter.service.UserService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "${FRONTEND_URL}")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PorterRepository porterRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserService userService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            if (registerRequest.getRole().toUpperCase().equals("ADMIN")) {
                throw new RuntimeException("Cannot register as ADMIN");
            }

            if (userRepository.existsByUsername(registerRequest.getUsername())) {
                return ResponseEntity.badRequest().body("Username is already taken!");
            }

            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                return ResponseEntity.badRequest().body("Email is already registered!");
            }

            // Create user
            User user = new User();
            user.setUsername(registerRequest.getUsername());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            user.setRole(UserRole.valueOf(registerRequest.getRole().toUpperCase()));
            user.setVerified(false); // User must verify OTP
            userRepository.save(user);

            // If user is registering as a porter, create porter profile
            if (UserRole.valueOf(registerRequest.getRole().toUpperCase()) == UserRole.PORTER) {
                Porter porter = new Porter();
                porter.setName(registerRequest.getUsername());
                porter.setEmail(registerRequest.getEmail());
                porter.setPhone(registerRequest.getPhone());
                porter.setVehicleType(registerRequest.getVehicleType());
                porter.setLicenseNumber(registerRequest.getLicenseNumber());
                porter.setStatus("PENDING"); // Default status for new porters
                porter.setRating(0.0); // Default rating
                porter.setVerified(false); // Porter must verify OTP
                porterRepository.save(porter);
            }

            // Send welcome/registration email
            String subject = "Welcome to PORTER▸XPRESSO!";
            String content = String.format(
                "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);'>"
                + "<div style='text-align: center;'>"
                + "<img src='https://img.icons8.com/emoji/48/delivery-truck.png' alt='Welcome' width='50' height='50' />"
                + "<h2 style='color: #007bff; margin-bottom: 10px;'>Welcome to PORTER▸XPRESSO!</h2>"
                + "</div>"
                + "<p style='font-size: 16px; color: #333;'>Dear <strong>%s</strong>,</p>"
                + "<p style='font-size: 15px; color: #555;'>Thank you for registering as a %s on PORTER▸XPRESSO. Please verify your email using the OTP sent to your inbox to activate your account.</p>"
                + "<p style='font-size: 14px; color: #666;'>If you have any questions, feel free to contact our support team.</p>"
                + "<p style='font-size: 14px; color: #333; margin-top: 30px;'>Best regards,<br><strong>PORTER▸XPRESSO Team</strong></p>"
                + "</div>",
                user.getUsername(), user.getRole().name().toLowerCase()
            );
            emailService.sendEmail(user.getEmail(), subject, content);

            UserDTO userDTO = new UserDTO(user);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully! Please verify OTP sent to your email.");
            response.put("user", userDTO);
            response.put("requiresOtp", true);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Registration error: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Find user by username
            User user = userService.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("Invalid credentials"));


            if(user.isBlocked()){
                return ResponseEntity.ok(AuthResponse.builder()
                        .success(false)
                        .message("User is Blocked By Admin!")
                        .requiresOtp(false)
                        .build());
            }

            // Verify password
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                return ResponseEntity.ok(AuthResponse.builder()
                        .success(false)
                        .message("Invalid credentials")
                        .requiresOtp(false)
                        .build());
            }

            // Generate and send OTP
            otpService.generateAndSendOtp(user.getUsername(), user.getEmail());
            UserDTO userDTO = UserDTO.fromEntity(user);

            return ResponseEntity.ok(AuthResponse.builder()
                    .success(true)
                    .message("OTP has been sent to your email")
                    .requiresOtp(true)
                    .user(userDTO)
                    .build());

        } catch (Exception e) {
            logger.error("Login error: ", e);
            return ResponseEntity.ok(AuthResponse.builder()
                    .success(false)
                    .message("Invalid credentials")
                    .requiresOtp(false)
                    .build());
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestBody OtpVerificationRequest request) {
        try {
            if (otpService.verifyOtp(request.getUsername(), request.getOtp())) {
                User user = userService.findByUsername(request.getUsername())
                        .orElseThrow(() -> new RuntimeException("User not found"));
                user.setVerified(true);
                userRepository.save(user);
                // If porter, also set porter.verified=true
                if (user.getRole() == UserRole.PORTER) {
                    Optional<Porter> porterOpt = porterRepository.findByName(user.getUsername());
                    if (porterOpt.isPresent()) {
                        Porter porter = porterOpt.get();
                        porter.setVerified(true);
                        porterRepository.save(porter);
                        if (!"APPROVED".equalsIgnoreCase(porter.getStatus())) {
                            return ResponseEntity.ok(AuthResponse.builder()
                                    .success(false)
                                    .message(
                                            "Your account is not active yet. Please contact admin to approve your porter account.")
                                    .requiresOtp(false)
                                    .build());
                        }
                    }
                }
                String token = jwtTokenProvider.generateToken(user.getUsername());
                UserDTO userDTO = new UserDTO(user);
                return ResponseEntity.ok(AuthResponse.builder()
                        .success(true)
                        .message("Authentication successful")
                        .token(token)
                        .role(user.getRole().name())
                        .user(userDTO)
                        .requiresOtp(false)
                        .build());
            } else {
                return ResponseEntity.ok(AuthResponse.builder()
                        .success(false)
                        .message("Invalid OTP")
                        .requiresOtp(true)
                        .build());
            }
        } catch (Exception e) {
            return ResponseEntity.ok(AuthResponse.builder()
                    .success(false)
                    .message("Error verifying OTP: " + e.getMessage())
                    .requiresOtp(true)
                    .build());
        }
    }

    @PostMapping("/forget-password")
    public ResponseEntity<?> sendResetOTP(@RequestBody ForgetPasswordRequest request) {
        String usernameOrEmail = request.getUserName();

        if (usernameOrEmail == null || usernameOrEmail.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username or email is required"));
        }

        User user = userRepository.findByUsername(usernameOrEmail)
                .or(() -> userRepository.findByEmail(usernameOrEmail))
                .orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }
        otpService.generateAndSendOtp(user.getUsername(), user.getEmail());
        return ResponseEntity.ok(Map.of("message", "OTP sent to your email"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ForgetPasswordRequest request) {
        String username = request.getUserName();
        String otp = request.getOtp();
        String newPassword = request.getNewPassword();
        String token = request.getToken();

        if (StringUtils.isBlank(newPassword)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password is required!"));
        }

        User user = null;

        if (StringUtils.isNotBlank(username)) {
            if (StringUtils.isBlank(otp)) {
                return ResponseEntity.badRequest().body(Map.of("message", "OTP is required!"));
            }

            boolean validOtp = otpService.verifyOtp(username, otp);
            if (!validOtp) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid or expired OTP"));
            }

            user = userRepository.findByUsername(username)
                    .orElse(null);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found with username"));
            }

        } else if (StringUtils.isNotBlank(token)) {
            user = userRepository.findByResetToken(token)
                    .orElse(null);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Invalid Token!"));
            }

            if (user.isResetTokenUsed()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Reset link already used"));
            }

            if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Reset link has expired"));
            }
            user.setResetTokenUsed(true);

        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid Link!"));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserDTO userDTO = new UserDTO(user);
        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        response.put("user", userDTO);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {
        try {
            // Get user
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Verify current password
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Current password is incorrect"));
            }

            // Check if new password is same as current password
            if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "New password must be different from the current password"));
            }

            // Update password
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error changing password: " + e.getMessage()));
        }
    }

    @PostMapping("/reset-password-link/{email}")
    public ResponseEntity<?> resetPasswordLink(@PathVariable String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = optionalUser.get();

        String token = UUID.randomUUID().toString();

        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(5));
        user.setResetTokenUsed(false);
        userRepository.save(user);
        String resetLink = frontendUrl + "/reset-password?token=" + token;
        String subject = "Reset Your Password";
        String content = String.format(
                """
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                                <div style="text-align: center;">
                                        <div style="text-align: center;">
                                            <img src="https://img.icons8.com/emoji/48/delivery-truck.png" alt="Delivery Truck" width="50" height="50" />
                                </div>

                                    <h2 style="color: #007bff; margin-bottom: 10px;">𝑃𝑜𝑟𝑡𝑒𝑟𝑊𝑎𝑎𝑙𝑒 - Password Reset</h2>
                                </div>

                                <p style="font-size: 16px; color: #333;">Hi <strong>%s</strong>,</p>

                                <p style="font-size: 15px; color: #555;">
                                    We received a request to reset your password for your 𝑃𝑜𝑟𝑡𝑒𝑟𝑊𝑎𝑎𝑙𝑒 account. Click the button below to choose a new password.
                                </p>

                                <div style="text-align: center; margin: 30px 0;">
                                    <a href="%s"
                                       style="background-color: #007bff; color: white; padding: 14px 28px; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 8px; display: inline-block;">
                                         Reset Password
                                    </a>
                                </div>

                                                       <p style="font-size: 14px; color: #888; text-align: center;">
                            <img src="https://img.icons8.com/ios-filled/16/888888/hourglass.png" alt="Hourglass Icon" style="vertical-align: middle; margin-right: 6px;" />
                            This link will expire in <strong>5 minutes</strong> for your security.
                        </p>

                                <p style="font-size: 14px; color: #666;">
                                    If you did not request this, please ignore this email. No changes will be made to your account.
                                </p>

                                <p style="font-size: 14px; color: #333; margin-top: 30px;">
                                    Thanks,<br>
                                    <strong>𝑃𝑜𝑟𝑡𝑒𝑟𝑊𝑎𝑎𝑙𝑒 Support Team</strong>
                                </p>
                            </div>
                        """,
                user.getUsername(), resetLink);

        emailService.sendEmail(user.getEmail(), subject, content);
        return ResponseEntity.ok("Password reset link sent successfully");
    }

}