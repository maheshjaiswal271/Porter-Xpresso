package com.porter.DTO;

public class AuthResponse {
    private boolean success;
    private String message;
    private String token;
    private String role;
    private boolean requiresOtp;
    private UserDTO user;

    // Default constructor
    public AuthResponse() {
    }

    // Builder constructor
    private AuthResponse(Builder builder) {
        this.success = builder.success;
        this.message = builder.message;
        this.token = builder.token;
        this.role = builder.role;
        this.requiresOtp = builder.requiresOtp;
        this.user = builder.user;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isRequiresOtp() {
        return requiresOtp;
    }

    public void setRequiresOtp(boolean requiresOtp) {
        this.requiresOtp = requiresOtp;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    // Builder class
    public static class Builder {
        private boolean success;
        private String message;
        private String token;
        private String role;
        private boolean requiresOtp;
        private UserDTO user;

        public Builder success(boolean success) {
            this.success = success;
            return this;
        }

        public Builder message(String message) {
            this.message = message;
            return this;
        }

        public Builder token(String token) {
            this.token = token;
            return this;
        }

        public Builder role(String role) {
            this.role = role;
            return this;
        }

        public Builder requiresOtp(boolean requiresOtp) {
            this.requiresOtp = requiresOtp;
            return this;
        }

        public Builder user(UserDTO user) {
            this.user = user;
            return this;
        }

        public AuthResponse build() {
            return new AuthResponse(this);
        }
    }

    // Static builder method
    public static Builder builder() {
        return new Builder();
    }

    @Override
    public String toString() {
        return "AuthResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", token='[PROTECTED]'" +
                ", role='" + role + '\'' +
                ", requiresOtp=" + requiresOtp +
                ", user=" + user +
                '}';
    }
} 