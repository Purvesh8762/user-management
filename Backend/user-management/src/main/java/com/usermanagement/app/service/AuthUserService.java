package com.usermanagement.app.service;

import com.usermanagement.app.entity.LoginUser;
import com.usermanagement.app.repository.LoginUserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthUserService {

    private final LoginUserRepository repo;
    private final EmailService emailService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Strong password regex
    private static final String PASSWORD_REGEX =
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$";

    public AuthUserService(LoginUserRepository repo, EmailService emailService) {
        this.repo = repo;
        this.emailService = emailService;
    }

    // ---------- REGISTER ----------
    public LoginUser register(String name, String email, String password){

        if(repo.existsByEmail(email)){
            throw new RuntimeException("Email already exists");
        }

        if(!password.matches(PASSWORD_REGEX)){
            throw new RuntimeException("Password not strong enough");
        }

        LoginUser user = new LoginUser();
        user.setName(name);
        user.setEmail(email);

        // 🔐 Encrypt password
        user.setPassword(passwordEncoder.encode(password));

        return repo.save(user);
    }

    // ---------- LOGIN ----------
    public LoginUser login(String email, String password){

        LoginUser user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if(!passwordEncoder.matches(password, user.getPassword())){
            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }

    // ---------- SEND OTP ----------
    public String sendOtp(String email){

        LoginUser user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

        repo.save(user);
        emailService.sendOtp(email, otp);

        return "OTP sent successfully";
    }

    // ---------- RESET PASSWORD ----------
    public String resetPassword(String email, String otp, String newPassword){

        LoginUser user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(user.getOtp() == null || !user.getOtp().equals(otp)){
            throw new RuntimeException("Invalid OTP");
        }

        if(user.getOtpExpiry().isBefore(LocalDateTime.now())){
            throw new RuntimeException("OTP expired");
        }

        if(!newPassword.matches(PASSWORD_REGEX)){
            throw new RuntimeException("Password not strong enough");
        }

        // 🔐 Encrypt new password
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setOtp(null);
        user.setOtpExpiry(null);

        repo.save(user);

        return "Password reset successful";
    }
}
