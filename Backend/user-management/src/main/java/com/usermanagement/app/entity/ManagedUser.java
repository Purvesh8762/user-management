package com.usermanagement.app.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "managed_users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"email","admin_id"})
        }
)
public class ManagedUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User name
    @Column(nullable = false, length = 100)
    private String name;

    // User email
    @Column(nullable = false, length = 100)
    private String email;

    // Admin who created this user
    @Column(name = "admin_id", nullable = false)
    private Long adminId;

    // ---------------- GETTERS & SETTERS ----------------

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

    // Always store email lowercase
    public void setEmail(String email) {
        this.email = email.toLowerCase();
    }

    public Long getAdminId() {
        return adminId;
    }

    public void setAdminId(Long adminId) {
        this.adminId = adminId;
    }
}
