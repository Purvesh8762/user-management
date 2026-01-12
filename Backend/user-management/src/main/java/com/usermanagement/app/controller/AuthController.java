package com.usermanagement.app.controller;

import com.usermanagement.app.entity.LoginUser;
import com.usermanagement.app.entity.ManagedUser;
import com.usermanagement.app.service.AuthUserService;
import com.usermanagement.app.service.ManagedUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api")
public class AuthController {

    private final AuthUserService authService;
    private final ManagedUserService managedService;

    public AuthController(AuthUserService authService,
                          ManagedUserService managedService) {
        this.authService = authService;
        this.managedService = managedService;
    }

    // ---------- REGISTER ADMIN ----------
    @PostMapping("/register")
    public ResponseEntity<LoginUser> register(@RequestParam String name,
                                              @RequestParam String email,
                                              @RequestParam String password) {

        return ResponseEntity.ok(authService.register(name, email, password));
    }

    // ---------- LOGIN ADMIN ----------
    @PostMapping("/login")
    public ResponseEntity<LoginUser> login(@RequestBody LoginUser user) {
        return ResponseEntity.ok(
                authService.login(user.getEmail(), user.getPassword())
        );
    }

    // ---------- ADD USER ----------
    @PostMapping("/users/add")
    public ResponseEntity<ManagedUser> addUser(@RequestParam String name,
                                               @RequestParam String email,
                                               @RequestParam Long adminId) {

        return ResponseEntity.ok(
                managedService.addUser(name, email, adminId)
        );
    }

    // ---------- LIST USERS ----------
    @GetMapping("/users/list/{adminId}")
    public ResponseEntity<List<ManagedUser>> listUsers(@PathVariable Long adminId) {

        return ResponseEntity.ok(
                managedService.listUsers(adminId)
        );
    }

    // ---------- DELETE USER ----------
    @DeleteMapping("/users/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id){
        managedService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    // ---------- FORGOT PASSWORD ----------
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        return ResponseEntity.ok(authService.sendOtp(email));
    }

    // ---------- RESET PASSWORD ----------
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String email,
                                                @RequestParam String otp,
                                                @RequestParam String newPassword) {

        return ResponseEntity.ok(
                authService.resetPassword(email, otp, newPassword)
        );
    }
}
