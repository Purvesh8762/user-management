package com.usermanagement.app.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "login_users",
        indexes = {
                @Index(name = "idx_email", columnList = "email")
        }
)
public class LoginUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Admin email (stored lowercase, unique)
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    // Admin name
    @Column(nullable = false, length = 100)
    private String name;

    // Encrypted password
    @JsonIgnore
    @Column(nullable = false)
    private String password;

    // Role (ADMIN by default)
    @Column(nullable = false, length = 20)
    private String role = "ADMIN";

    // OTP
    @Column(length = 6)
    private String otp;

    // OTP expiry
    private LocalDateTime otpExpiry;

    // ---------------- GETTERS & SETTERS ----------------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    // Always store email lowercase
    public void setEmail(String email) {
        this.email = email.toLowerCase();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    // Password must always be encrypted before saving
    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public LocalDateTime getOtpExpiry() {
        return otpExpiry;
    }

    public void setOtpExpiry(LocalDateTime otpExpiry) {
        this.otpExpiry = otpExpiry;
    }
}
