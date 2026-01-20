package com.usermanagement.app.service;

import com.usermanagement.app.entity.LoginUser;
import com.usermanagement.app.repository.LoginUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthUserService {

    // Repository to talk with database
    private final LoginUserRepository repo;

    // Service to send email
    private final EmailService emailService;

    // Password encoder for encrypting passwords
    private final PasswordEncoder passwordEncoder;

    // Password must contain:
    // 1 lowercase, 1 uppercase, 1 number, 1 symbol, minimum 8 characters
    private static final String PASSWORD_REGEX =
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$";

    public AuthUserService(LoginUserRepository repo,
                           EmailService emailService,
                           PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    // Find user by email (used in login, otp, reset)
    public LoginUser findByEmail(String email){
        return repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Register new admin user
    public LoginUser register(String name, String email, String password){

        // Check if email already exists
        if(repo.existsByEmail(email)){
            throw new RuntimeException("Email already registered");
        }

        // Check password strength
        if(!password.matches(PASSWORD_REGEX)){
            throw new RuntimeException("Password must be strong");
        }

        // Create new user object
        LoginUser user = new LoginUser();
        user.setName(name);
        user.setEmail(email);

        // Encrypt password before saving
        user.setPassword(passwordEncoder.encode(password));

        // Save in database
        return repo.save(user);
    }

    // Login user
    public LoginUser login(String email, String password){

        // Fetch user from DB
        LoginUser user = findByEmail(email);

        // Compare encrypted password
        if(!passwordEncoder.matches(password, user.getPassword())){
            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }

    // Send OTP for forgot password
    public String sendOtp(String email){

        // Find user
        LoginUser user = findByEmail(email);

        // Generate 6 digit OTP
        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        // Save OTP and expiry time
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

        repo.save(user);

        // Send OTP to email
        emailService.sendOtp(email, otp);

        return "OTP sent successfully to email";
    }

    // Reset password using OTP
    public String resetPassword(String email, String otp, String newPassword){

        // Find user
        LoginUser user = findByEmail(email);

        // Validate OTP
        if(user.getOtp() == null || !user.getOtp().equals(otp)){
            throw new RuntimeException("Invalid OTP");
        }

        // Check OTP expiry
        if(user.getOtpExpiry().isBefore(LocalDateTime.now())){
            throw new RuntimeException("OTP has expired");
        }

        // Check new password strength
        if(!newPassword.matches(PASSWORD_REGEX)){
            throw new RuntimeException("Password must be strong");
        }

        // Encrypt and update password
        user.setPassword(passwordEncoder.encode(newPassword));

        // Clear OTP values
        user.setOtp(null);
        user.setOtpExpiry(null);

        repo.save(user);

        return "Password reset successfully";
    }
}
