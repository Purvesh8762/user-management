package com.usermanagement.app.repository;

import com.usermanagement.app.entity.LoginUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LoginUserRepository extends JpaRepository<LoginUser, Long> {

    Optional<LoginUser> findByEmail(String email);

    Optional<LoginUser> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

}
