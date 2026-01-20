package com.usermanagement.app.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    // Secret key used to sign JWT (keep it safe in real projects)
    private final String SECRET = "MyJwtSecretKeyMyJwtSecretKey12345";

    // Create JWT token for user email
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)                 // who is this token for
                .setIssuedAt(new Date())           // token creation time
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day expiry
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    // Read email from JWT token
    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(SECRET.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
