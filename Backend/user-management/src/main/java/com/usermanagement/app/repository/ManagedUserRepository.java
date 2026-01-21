package com.usermanagement.app.repository;

import com.usermanagement.app.entity.ManagedUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ManagedUserRepository extends JpaRepository<ManagedUser, Long> {

    // Case-insensitive email under admin
    Optional<ManagedUser> findByEmailIgnoreCaseAndAdminId(String email, Long adminId);

    // Check duplicate under admin
    boolean existsByEmailIgnoreCaseAndAdminId(String email, Long adminId);

    // List users for admin
    List<ManagedUser> findByAdminId(Long adminId);
}
