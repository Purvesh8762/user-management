package com.usermanagement.app.repository;

import com.usermanagement.app.entity.LoginUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoginUserRepository extends JpaRepository<LoginUser, Long> {

    // Find user by email (used in login, OTP, reset password)
    Optional<LoginUser> findByEmail(String email);

    // Check if email already exists during registration
    boolean existsByEmail(String email);

}
