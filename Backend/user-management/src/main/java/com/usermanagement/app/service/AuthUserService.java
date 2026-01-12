package com.usermanagement.app.service;

import com.usermanagement.app.entity.LoginUser;
import com.usermanagement.app.repository.LoginUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthUserService {

    private final LoginUserRepository repo;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    // Strong password rule
    private static final String PASSWORD_REGEX =
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$";

    public AuthUserService(LoginUserRepository repo,
                           EmailService emailService,
                           PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }


    // Register new admin user

    public LoginUser register(String name, String email, String password){

        if(repo.existsByEmail(email)){
            throw new RuntimeException("Email already registered");
        }

        if(!password.matches(PASSWORD_REGEX)){
            throw new RuntimeException("Password must be strong (8 chars, upper, lower, number, symbol)");
        }

        LoginUser user = new LoginUser();
        user.setName(name);
        user.setEmail(email);

        // Encrypt password before saving
        user.setPassword(passwordEncoder.encode(password));

        return repo.save(user);
    }


    // Login user

    public LoginUser login(String email, String password){

        LoginUser user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Compare encrypted password
        if(!passwordEncoder.matches(password, user.getPassword())){
            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }


    // Send OTP for password reset
    public String sendOtp(String email){

        LoginUser user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

        repo.save(user);

        emailService.sendOtp(email, otp);

        return "OTP sent successfully to email";
    }


    // Reset password using OTP

    public String resetPassword(String email, String otp, String newPassword){

        LoginUser user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(user.getOtp() == null || !user.getOtp().equals(otp)){
            throw new RuntimeException("Invalid OTP");
        }

        if(user.getOtpExpiry().isBefore(LocalDateTime.now())){
            throw new RuntimeException("OTP has expired");
        }

        if(!newPassword.matches(PASSWORD_REGEX)){
            throw new RuntimeException("Password must be strong");
        }

        // Encrypt new password
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setOtp(null);
        user.setOtpExpiry(null);

        repo.save(user);

        return "Password reset successfully";
    }
}
