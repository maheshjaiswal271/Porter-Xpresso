package com.porter.service;

import java.util.List;
import java.util.Optional;

import com.porter.model.User;
import com.porter.model.enums.UserRole;

public interface UserService {
    Optional<User> findByUsername(String username);
    
    User createUser(User user);
    
    User updateUser(User user);
    
    void deleteUser(Long id);
    
    Optional<User> getUserById(Long id);
    
    List<User> getAllUsers();
    
    List<User> getUsersByRole(UserRole role);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
} 