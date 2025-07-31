package com.porter.DTO;

public class PaymentRequest {
    private double amount;
    private String paymentMethod;
    private CardDetails cardDetails;

    // Default constructor
    public PaymentRequest() {
    }

    // Getters and Setters
    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public CardDetails getCardDetails() {
        return cardDetails;
    }

    public void setCardDetails(CardDetails cardDetails) {
        this.cardDetails = cardDetails;
    }

    @Override
    public String toString() {
        return "PaymentRequest{" +
                "amount=" + amount +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", cardDetails=" + cardDetails +
                '}';
    }

    public static class CardDetails {
        private String cardNumber;
        private String expiryDate;
        private String cvv;
        private String name;

        // Default constructor
        public CardDetails() {
        }

        // Getters and Setters
        public String getCardNumber() {
            return cardNumber;
        }

        public void setCardNumber(String cardNumber) {
            this.cardNumber = cardNumber;
        }

        public String getExpiryDate() {
            return expiryDate;
        }

        public void setExpiryDate(String expiryDate) {
            this.expiryDate = expiryDate;
        }

        public String getCvv() {
            return cvv;
        }

        public void setCvv(String cvv) {
            this.cvv = cvv;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        @Override
        public String toString() {
            return "CardDetails{" +
                    "cardNumber='[PROTECTED]'" +
                    ", expiryDate='[PROTECTED]'" +
                    ", cvv='[PROTECTED]'" +
                    ", name='" + name + '\'' +
                    '}';
        }
    }
} 