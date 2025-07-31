package com.porter.DTO;

import com.porter.model.Location;

public class LocationDTO {
    private Double latitude;
    private Double longitude;
    private String address;

    // Default constructor
    public LocationDTO() {
    }

    // Parameterized constructor
    public LocationDTO(Double latitude, Double longitude, String address) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
    }

    // Getters and Setters
    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Override
    public String toString() {
        return "LocationDTO{" +
                "latitude=" + latitude +
                ", longitude=" + longitude +
                ", address='" + address + '\'' +
                '}';
    }

    public static LocationDTO fromEntity(Location location) {
        if (location == null) {
            return null;
        }
        return new LocationDTO(
            location.getLatitude(),
            location.getLongitude(),
            location.getAddress()
        );
    }
} 