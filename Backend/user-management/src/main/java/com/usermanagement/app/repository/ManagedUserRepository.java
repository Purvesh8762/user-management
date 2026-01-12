package com.usermanagement.app.repository;

import com.usermanagement.app.entity.ManagedUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ManagedUserRepository extends JpaRepository<ManagedUser, Long> {

    // Find managed user by email
    Optional<ManagedUser> findByEmail(String email);

    // Get all users under a specific admin
    List<ManagedUser> findByAdminId(Long adminId);
}
