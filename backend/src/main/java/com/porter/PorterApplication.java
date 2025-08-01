package com.porter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@ComponentScan(basePackages = "com.porter")
@EntityScan(basePackages = "com.porter")
@EnableJpaRepositories(basePackages = "com.porter")
@EnableAsync
public class PorterApplication {

    public static void main(String[] args) {
        SpringApplication.run(PorterApplication.class, args);
    }

} 