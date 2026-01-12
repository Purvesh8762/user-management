package com.usermanagement.app.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "managed_users")
public class ManagedUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User name
    @Column(nullable = false, length = 100)
    private String name;

    // User email (unique)
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    // Admin who created this user
    @Column(nullable = false)
    private Long adminId;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getAdminId() {
        return adminId;
    }

    public void setAdminId(Long adminId) {
        this.adminId = adminId;
    }
}
