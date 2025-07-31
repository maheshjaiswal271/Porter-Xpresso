package com.porter.DTO;

public class PaymentResponse {
    private boolean success;
    private String paymentId;
    private String message;

    // Default constructor
    public PaymentResponse() {
    }

    // Builder constructor
    private PaymentResponse(Builder builder) {
        this.success = builder.success;
        this.paymentId = builder.paymentId;
        this.message = builder.message;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    // Builder class
    public static class Builder {
        private boolean success;
        private String paymentId;
        private String message;

        public Builder success(boolean success) {
            this.success = success;
            return this;
        }

        public Builder paymentId(String paymentId) {
            this.paymentId = paymentId;
            return this;
        }

        public Builder message(String message) {
            this.message = message;
            return this;
        }

        public PaymentResponse build() {
            return new PaymentResponse(this);
        }
    }

    // Static builder method
    public static Builder builder() {
        return new Builder();
    }

    @Override
    public String toString() {
        return "PaymentResponse{" +
                "success=" + success +
                ", paymentId='" + paymentId + '\'' +
                ", message='" + message + '\'' +
                '}';
    }
} 