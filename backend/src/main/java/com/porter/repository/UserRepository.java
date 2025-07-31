package com.porter.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.porter.model.User;
import com.porter.model.enums.UserRole;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    public boolean existsByEmail(String email);

    List<User> findByRole(UserRole role);

    boolean existsByUsername(String username);

    public Optional<User> findByEmail(String usernameOrEmail);

    public Optional<User> findByResetToken(String token);
} 