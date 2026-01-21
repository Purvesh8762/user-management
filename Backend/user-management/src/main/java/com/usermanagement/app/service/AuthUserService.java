package com.usermanagement.app.service;

import com.usermanagement.app.entity.LoginUser;
import com.usermanagement.app.repository.LoginUserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class AuthUserService {

    private final LoginUserRepository loginUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthUserService(LoginUserRepository loginUserRepository,
                           PasswordEncoder passwordEncoder) {
        this.loginUserRepository = loginUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // REGISTER ADMIN
    public LoginUser register(String name, String email, String password) {

        if (password == null || password.trim().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }

        if (loginUserRepository.existsByEmailIgnoreCase(email)) {
            throw new RuntimeException("Email already registered");
        }

        LoginUser user = new LoginUser();
        user.setName(name);
        user.setEmail(email.toLowerCase());
        user.setPassword(passwordEncoder.encode(password));

        return loginUserRepository.save(user);
    }

    // FIND USER BY EMAIL
    public LoginUser findByEmail(String email) {
        return loginUserRepository.findByEmailIgnoreCase(email).orElse(null);
    }

    // SEND OTP
    public String sendOtp(String email) {

        LoginUser user = loginUserRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));

        SecureRandom random = new SecureRandom();
        String otp = String.valueOf(100000 + random.nextInt(900000));

        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

        loginUserRepository.save(user);

        // Here you should call email service
        return "OTP sent successfully";
    }

    // RESET PASSWORD
    public String resetPassword(String email, String otp, String newPassword) {

        if (newPassword == null || newPassword.trim().length() < 6) {
            return "Password must be at least 6 characters";
        }

        LoginUser user = loginUserRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));

        if (user.getOtp() == null || user.getOtpExpiry() == null) {
            return "OTP not requested";
        }

        if (!user.getOtp().equals(otp)) {
            return "Invalid OTP";
        }

        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            return "OTP expired";
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setOtp(null);
        user.setOtpExpiry(null);

        loginUserRepository.save(user);

        return "Password reset successfully";
    }
}
