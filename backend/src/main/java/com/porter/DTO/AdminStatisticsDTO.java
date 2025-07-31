package com.porter.DTO;

public class AdminStatisticsDTO {
    private long totalUsers;
    private long totalPorters;
    private long totalDeliveries;
    private double totalRevenue;
    private long activeDeliveries;
    private long completedDeliveries;
    private long cancelledDeliveries;

    // Default constructor
    public AdminStatisticsDTO() {
    }

    // Parameterized constructor
    public AdminStatisticsDTO(long totalUsers, long totalPorters, long totalDeliveries,
                            double totalRevenue, long activeDeliveries, long completedDeliveries,
                            long cancelledDeliveries) {
        this.totalUsers = totalUsers;
        this.totalPorters = totalPorters;
        this.totalDeliveries = totalDeliveries;
        this.totalRevenue = totalRevenue;
        this.activeDeliveries = activeDeliveries;
        this.completedDeliveries = completedDeliveries;
        this.cancelledDeliveries = cancelledDeliveries;
    }

    // Getters and Setters
    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalPorters() {
        return totalPorters;
    }

    public void setTotalPorters(long totalPorters) {
        this.totalPorters = totalPorters;
    }

    public long getTotalDeliveries() {
        return totalDeliveries;
    }

    public void setTotalDeliveries(long totalDeliveries) {
        this.totalDeliveries = totalDeliveries;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getActiveDeliveries() {
        return activeDeliveries;
    }

    public void setActiveDeliveries(long activeDeliveries) {
        this.activeDeliveries = activeDeliveries;
    }

    public long getCompletedDeliveries() {
        return completedDeliveries;
    }

    public void setCompletedDeliveries(long completedDeliveries) {
        this.completedDeliveries = completedDeliveries;
    }

    public long getCancelledDeliveries() {
        return cancelledDeliveries;
    }

    public void setCancelledDeliveries(long cancelledDeliveries) {
        this.cancelledDeliveries = cancelledDeliveries;
    }

    @Override
    public String toString() {
        return "AdminStatisticsDTO{" +
                "totalUsers=" + totalUsers +
                ", totalPorters=" + totalPorters +
                ", totalDeliveries=" + totalDeliveries +
                ", totalRevenue=" + totalRevenue +
                ", activeDeliveries=" + activeDeliveries +
                ", completedDeliveries=" + completedDeliveries +
                ", cancelledDeliveries=" + cancelledDeliveries +
                '}';
    }
} 