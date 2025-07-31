package com.porter.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.porter.model.Porter;
 
@Repository
public interface PorterRepository extends JpaRepository<Porter, Long> {
    long countByStatus(String status);
    Optional<Porter> findByEmail(String email);
    Optional<Porter> findByName(String name);
    List<Porter> findAllByStatus(String status);
} 