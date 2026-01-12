package com.usermanagement.app.repository;

import com.usermanagement.app.entity.ManagedUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ManagedUserRepository extends JpaRepository<ManagedUser, Long> {

    Optional<ManagedUser> findByEmail(String email);

    List<ManagedUser> findByAdminId(Long adminId);
}
