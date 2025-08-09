package com.porter.DTO;

public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String role;
    private String vehicleType;
    private String licenseNumber;
    private String phone;

    // Default constructor
    public RegisterRequest() {
    }

    // Parameterized constructor
    public RegisterRequest(String username, String email, String password, String role, String vehicleType, String licenseNumber, String phone) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.vehicleType = vehicleType;
        this.licenseNumber = licenseNumber;
        this.phone = phone;
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    // toString method
    @Override
    public String toString() {
        return "RegisterRequest{" +
                "username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", password='[PROTECTED]'" +
                ", role='" + role + '\'' +
                '}';
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
} 