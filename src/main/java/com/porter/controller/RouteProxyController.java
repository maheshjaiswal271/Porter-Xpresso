package com.porter.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class RouteProxyController {
    
    @Value("${FRONTEND_URL}")
    private String frontendUrl;
    
    @CrossOrigin(origins = "${FRONTEND_URL}") // Allow frontend origin
    @RequestMapping("/api/proxy/osrm/**")
    public ResponseEntity<String> proxyRoute(HttpServletRequest request) {
        String fullPath = request.getRequestURI();
        String path = fullPath.substring(fullPath.indexOf("/api/proxy/osrm/") + "/api/proxy/osrm/".length());
        StringBuilder url = new StringBuilder("https://router.project-osrm.org/" + path);
        String queryString = request.getQueryString();
        if (queryString != null && !queryString.isEmpty()) {
            url.append("?").append(queryString);
        }
        System.out.println("Proxying to: " + url);
        RestTemplate restTemplate = new RestTemplate();
        try {
            String response = restTemplate.getForObject(url.toString(), String.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error proxying to OSRM: " + e.getMessage());
            return ResponseEntity.status(400).body("{\"error\":\"Failed to fetch route from OSRM.\"}");
        }
    }
} 