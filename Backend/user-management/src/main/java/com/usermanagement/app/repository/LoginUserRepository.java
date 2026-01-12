package com.usermanagement.app.repository;

import com.usermanagement.app.entity.LoginUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoginUserRepository extends JpaRepository<LoginUser, Long> {

    Optional<LoginUser> findByEmail(String email);

    Optional<LoginUser> findByEmailAndPassword(String email, String password);

    boolean existsByEmail(String email);
}
