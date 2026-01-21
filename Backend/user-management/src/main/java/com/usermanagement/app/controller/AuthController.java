package com.usermanagement.app.controller;

import com.usermanagement.app.entity.LoginUser;
import com.usermanagement.app.entity.ManagedUser;
import com.usermanagement.app.service.AuthUserService;
import com.usermanagement.app.service.ManagedUserService;
import com.usermanagement.app.config.JwtUtil;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthUserService authService;
    private final ManagedUserService managedService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthController(AuthUserService authService,
                          ManagedUserService managedService,
                          JwtUtil jwtUtil,
                          AuthenticationManager authenticationManager) {
        this.authService = authService;
        this.managedService = managedService;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String,String> body) {
        return ResponseEntity.ok(
                authService.register(
                        body.get("name"),
                        body.get("email"),
                        body.get("password")
                )
        );
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> body) {

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        body.get("email"),
                        body.get("password")
                )
        );

        SecurityContextHolder.getContext().setAuthentication(auth);

        String token = jwtUtil.generateToken(body.get("email"));

        LoginUser user = authService.findByEmail(body.get("email"));

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "type", "Bearer",
                        "email", user.getEmail(),
                        "id", user.getId()
                )
        );
    }

    // ADD USER
    @PostMapping("/users/add")
    public ResponseEntity<ManagedUser> addUser(@RequestBody Map<String,String> body,
                                               Authentication authentication) {

        String email = authentication.getName();
        LoginUser admin = authService.findByEmail(email);

        return ResponseEntity.ok(
                managedService.addUser(
                        body.get("name"),
                        body.get("email"),
                        admin.getId()
                )
        );
    }

    // LIST USERS
    @GetMapping("/users/list")
    public ResponseEntity<List<ManagedUser>> listUsers(Authentication authentication) {

        String email = authentication.getName();
        LoginUser admin = authService.findByEmail(email);

        return ResponseEntity.ok(
                managedService.listUsers(admin.getId())
        );
    }

    // DELETE USER
    @DeleteMapping("/users/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id,
                                             Authentication authentication) {

        String email = authentication.getName();
        LoginUser admin = authService.findByEmail(email);

        managedService.deleteUser(id, admin.getId());

        return ResponseEntity.ok("User deleted successfully");
    }

    // FORGOT PASSWORD
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String,String> body) {
        return ResponseEntity.ok(authService.sendOtp(body.get("email")));
    }

    // RESET PASSWORD
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String,String> body) {
        return ResponseEntity.ok(
                authService.resetPassword(
                        body.get("email"),
                        body.get("otp"),
                        body.get("newPassword")
                )
        );
    }
}
