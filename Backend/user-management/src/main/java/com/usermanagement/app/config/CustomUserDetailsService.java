package com.usermanagement.app.config;

import com.usermanagement.app.entity.LoginUser;
import com.usermanagement.app.repository.LoginUserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final LoginUserRepository repo;

    public CustomUserDetailsService(LoginUserRepository repo) {
        this.repo = repo;
    }

    // Spring Security calls this to load user from DB
    @Override
    public UserDetails loadUserByUsername(String email) {

        LoginUser user = repo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Convert our user into Spring Security user
        return new User(user.getEmail(), user.getPassword(), List.of());
    }
}
