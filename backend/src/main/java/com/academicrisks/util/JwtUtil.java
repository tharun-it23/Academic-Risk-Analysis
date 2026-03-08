package com.academicrisks.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;

public class JwtUtil {

    private static final String SECRET_KEY = "AcademicRiskAnalysisSecretKey2024!@#$%";
    private static final long EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

    public static String generateToken(int userId, String username, String role) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("username", username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY.getBytes())
                .compact();
    }

    public static Claims validateToken(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(SECRET_KEY.getBytes())
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            return null;
        }
    }

    public static int getUserId(Claims claims) {
        return Integer.parseInt(claims.getSubject());
    }

    public static String getRole(Claims claims) {
        return claims.get("role", String.class);
    }

    public static String getUsername(Claims claims) {
        return claims.get("username", String.class);
    }
}
