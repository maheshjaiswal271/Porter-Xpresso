package com.porter.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.porter.model.Delivery;
import com.porter.model.PaymentStatus;
import com.porter.model.enums.DeliveryStatus;
import com.porter.model.enums.PackageType;

public class DeliveryDTO {
    private Long id;
    private UserDTO user;
    private PorterDTO porter;
    private LocationDTO pickupLocation;
    private LocationDTO deliveryLocation;
    private DeliveryStatus status;
    private PackageType packageType;
    private Double packageWeight;
    private String description;
    private BigDecimal deliveryFee;
    private BigDecimal amount;
    private Double distance;
    private LocalDateTime scheduledTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private PaymentStatus paymentStatus;

    // Default constructor
    public DeliveryDTO() {
    }

    // Builder constructor
    private DeliveryDTO(Builder builder) {
        this.id = builder.id;
        this.user = builder.user;
        this.porter = builder.porter;
        this.pickupLocation = builder.pickupLocation;
        this.deliveryLocation = builder.deliveryLocation;
        this.status = builder.status;
        this.packageType = builder.packageType;
        this.packageWeight = builder.packageWeight;
        this.description = builder.description;
        this.deliveryFee = builder.deliveryFee;
        this.amount = builder.amount;
        this.distance = builder.distance;
        this.scheduledTime = builder.scheduledTime;
        this.createdAt = builder.createdAt;
        this.updatedAt = builder.updatedAt;
        this.paymentStatus = builder.paymentStatus;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public PorterDTO getPorter() {
        return porter;
    }

    public void setPorter(PorterDTO porter) {
        this.porter = porter;
    }

    public LocationDTO getPickupLocation() {
        return pickupLocation;
    }

    public void setPickupLocation(LocationDTO pickupLocation) {
        this.pickupLocation = pickupLocation;
    }

    public LocationDTO getDeliveryLocation() {
        return deliveryLocation;
    }

    public void setDeliveryLocation(LocationDTO deliveryLocation) {
        this.deliveryLocation = deliveryLocation;
    }

    public DeliveryStatus getStatus() {
        return status;
    }

    public void setStatus(DeliveryStatus status) {
        this.status = status;
    }

    public PackageType getPackageType() {
        return packageType;
    }

    public void setPackageType(PackageType packageType) {
        this.packageType = packageType;
    }

    public Double getPackageWeight() {
        return packageWeight;
    }

    public void setPackageWeight(Double packageWeight) {
        this.packageWeight = packageWeight;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getDeliveryFee() {
        return deliveryFee;
    }

    public void setDeliveryFee(BigDecimal deliveryFee) {
        this.deliveryFee = deliveryFee;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }

    public LocalDateTime getScheduledTime() {
        return scheduledTime;
    }

    public void setScheduledTime(LocalDateTime scheduledTime) {
        this.scheduledTime = scheduledTime;
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

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    // Builder class
    public static class Builder {
        private Long id;
        private UserDTO user;
        private PorterDTO porter;
        private LocationDTO pickupLocation;
        private LocationDTO deliveryLocation;
        private DeliveryStatus status;
        private PackageType packageType;
        private Double packageWeight;
        private String description;
        private BigDecimal deliveryFee;
        private BigDecimal amount;
        private Double distance;
        private LocalDateTime scheduledTime;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private PaymentStatus paymentStatus;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder user(UserDTO user) {
            this.user = user;
            return this;
        }

        public Builder porter(PorterDTO porter) {
            this.porter = porter;
            return this;
        }

        public Builder pickupLocation(LocationDTO pickupLocation) {
            this.pickupLocation = pickupLocation;
            return this;
        }

        public Builder deliveryLocation(LocationDTO deliveryLocation) {
            this.deliveryLocation = deliveryLocation;
            return this;
        }

        public Builder status(DeliveryStatus status) {
            this.status = status;
            return this;
        }

        public Builder packageType(PackageType packageType) {
            this.packageType = packageType;
            return this;
        }

        public Builder packageWeight(Double packageWeight) {
            this.packageWeight = packageWeight;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder deliveryFee(BigDecimal deliveryFee) {
            this.deliveryFee = deliveryFee;
            return this;
        }

        public Builder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public Builder distance(Double distance) {
            this.distance = distance;
            return this;
        }

        public Builder scheduledTime(LocalDateTime scheduledTime) {
            this.scheduledTime = scheduledTime;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public Builder paymentStatus(PaymentStatus paymentStatus) {
            this.paymentStatus = paymentStatus;
            return this;
        }

        public DeliveryDTO build() {
            return new DeliveryDTO(this);
        }

    }

    // Static builder method
    public static Builder builder() {
        return new Builder();
    }

    @Override
    public String toString() {
        return "DeliveryDTO{" +
                "id=" + id +
                ", user=" + user +
                ", porter=" + porter +
                ", pickupLocation=" + pickupLocation +
                ", deliveryLocation=" + deliveryLocation +
                ", status=" + status +
                ", packageType=" + packageType +
                ", packageWeight=" + packageWeight +
                ", description='" + description + '\'' +
                ", deliveryFee=" + deliveryFee +
                ", amount=" + amount +
                ", distance=" + distance +
                ", scheduledTime=" + scheduledTime +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", paymentStatus=" + paymentStatus +
                '}';
    }

    public static DeliveryDTO fromEntity(Delivery delivery) {
        return DeliveryDTO.builder()
                .id(delivery.getId())
                .user(delivery.getUser() != null ? UserDTO.fromEntity(delivery.getUser()) : null)
                .porter(delivery.getPorter() != null ? PorterDTO.fromEntity(delivery.getPorter()) : null)
                .pickupLocation(LocationDTO.fromEntity(delivery.getPickupLocation()))
                .deliveryLocation(LocationDTO.fromEntity(delivery.getDeliveryLocation()))
                .status(delivery.getStatus())
                .packageType(delivery.getPackageType())
                .packageWeight(delivery.getPackageWeight())
                .description(delivery.getDescription())
                .deliveryFee(delivery.getDeliveryFee())
                .amount(delivery.getAmount())
                .distance(delivery.getDistance())
                .scheduledTime(delivery.getScheduledTime())
                .createdAt(delivery.getCreatedAt())
                .updatedAt(delivery.getUpdatedAt())    
                .paymentStatus(delivery.getPaymentStatus())
                .build();
    }
}