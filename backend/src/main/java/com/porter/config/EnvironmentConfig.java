package com.porter.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource(value = "file:src/.env", ignoreResourceNotFound = true)
public class EnvironmentConfig {
    // This configuration will attempt to load the .env file
    // If not found, it will use system environment variables or default values
} 