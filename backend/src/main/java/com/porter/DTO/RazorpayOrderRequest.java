package com.porter.DTO;

import java.math.BigDecimal;

public class RazorpayOrderRequest {
    private BigDecimal amount;
    private String currency;
    private String receipt;
    private String notes;
    private Long deliveryId;

    // Default constructor
    public RazorpayOrderRequest() {
    }

    // Getters and Setters
    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getReceipt() {
        return receipt;
    }

    public void setReceipt(String receipt) {
        this.receipt = receipt;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Long getDeliveryId() {
        return deliveryId;
    }

    public void setDeliveryId(Long deliveryId) {
        this.deliveryId = deliveryId;
    }

    @Override
    public String toString() {
        return "RazorpayOrderRequest{" +
                "amount=" + amount +
                ", currency='" + currency + '\'' +
                ", receipt='" + receipt + '\'' +
                ", notes='" + notes + '\'' +
                ", deliveryId=" + deliveryId +
                '}';
    }
} 