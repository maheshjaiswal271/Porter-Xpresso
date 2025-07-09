package com.porter.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class OtpService {
    private static final Logger logger = LoggerFactory.getLogger(OtpService.class);
    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 5;

    private final Map<String, OtpData> otpStore = new ConcurrentHashMap<>();

    @Autowired
    private JavaMailSender emailSender;

    private static class OtpData {
        String otp;
        LocalDateTime expiryTime;

        OtpData(String otp) {
            this.otp = otp;
            this.expiryTime = LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);
        }

        boolean isValid(String otpToVerify) {
            return otp.equals(otpToVerify) && LocalDateTime.now().isBefore(expiryTime);
        }
    }
    
    @Async
    public void generateAndSendOtp(String username, String email) {
        String otp = generateOtp();
        otpStore.put(username, new OtpData(otp));
        
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setTo(email);
            helper.setSubject("Porter - Your Login OTP");
            
            String emailContent = String.format("""
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Porter Login Verification</h2>
                    <p>Hello,</p>
                    <p>Your OTP for logging into Porter is:</p>
                    <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
                        <strong>%s</strong>
                    </div>
                    <p>This OTP will expire in %d minutes.</p>
                    <p style="color: #666; font-size: 12px;">If you didn't request this OTP, please ignore this email.</p>
                </div>
            """, otp, OTP_EXPIRY_MINUTES);
            
            helper.setText(emailContent, true);
            emailSender.send(message);
            
            logger.info("OTP sent successfully to: {}", email);
        } catch (MessagingException e) {
            logger.error("Failed to send OTP email to {}: {}", email, e.getMessage());
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }

    public boolean verifyOtp(String username, String otp) {
        OtpData otpData = otpStore.get(username);
        if (otpData != null && otpData.isValid(otp)) {
            otpStore.remove(username);
            return true;
        }
        return false;
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }
}