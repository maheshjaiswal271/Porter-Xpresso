package com.porter.DTO;

import java.time.LocalDateTime;

public class PorterDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String status;
    private String vehicleType;
    private String licenseNumber;
    private double rating;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Default constructor
    public PorterDTO() {
    }

    // Parameterized constructor
    public PorterDTO(Long id, String name, String email, String phone, String status,
            String vehicleType, String licenseNumber, double rating) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.status = status;
        this.vehicleType = vehicleType;
        this.licenseNumber = licenseNumber;
        this.rating = rating;
    }

    // Full parameterized constructor
    public PorterDTO(Long id, String name, String email, String phone, String status,
            String vehicleType, String licenseNumber, double rating, 
            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.status = status;
        this.vehicleType = vehicleType;
        this.licenseNumber = licenseNumber;
        this.rating = rating;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "PorterDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", status='" + status + '\'' +
                ", vehicleType='" + vehicleType + '\'' +
                ", licenseNumber='" + licenseNumber + '\'' +
                ", rating=" + rating +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }

    public static PorterDTO fromEntity(com.porter.model.Porter porter) {
        if (porter == null) {
            return null;
        }
        return new PorterDTO(
                porter.getId(),
                porter.getName(),
                porter.getEmail(),
                porter.getPhone(),
                porter.getStatus(),
                porter.getVehicleType(),
                porter.getLicenseNumber(),
                porter.getRating(),
                porter.getCreatedAt(),
                porter.getUpdatedAt());
    }
}