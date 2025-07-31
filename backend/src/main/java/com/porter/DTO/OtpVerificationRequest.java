package com.porter.DTO;

public class OtpVerificationRequest {
    private String username;
    private String otp;

    // Default constructor
    public OtpVerificationRequest() {
    }

    // Parameterized constructor
    public OtpVerificationRequest(String username, String otp) {
        this.username = username;
        this.otp = otp;
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    @Override
    public String toString() {
        return "OtpVerificationRequest{" +
                "username='" + username + '\'' +
                ", otp='[PROTECTED]'" +
                '}';
    }
} 