package com.example.levelupgamer.controller;

import com.example.levelupgamer.config.JwtUtil;
import com.example.levelupgamer.model.User;
import com.example.levelupgamer.dto.AuthRequest;
import com.example.levelupgamer.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    @PostMapping("/register")
    public String register(@RequestBody User u) {
        userService.register(u);
        return "Usuario creado";
    }

    @PostMapping("/login")
    public org.springframework.http.ResponseEntity<?> login(@RequestBody AuthRequest req) {

        // Aceptamos email/password desde el frontend y buscamos por el campo username (que guarda el email)
        String email = req.getEmail();
        if (email == null || email.isBlank()) {
            return org.springframework.http.ResponseEntity.badRequest().body("Email requerido");
        }

        User userFound = userService.findByEmail(email);

        if (userFound == null) {
            return org.springframework.http.ResponseEntity.status(404).body("Usuario no registrado");
        }

        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, req.getPassword())
            );

            if (auth.isAuthenticated()) {
                String token = jwtUtil.generateToken(userFound.getUsername());

                return org.springframework.http.ResponseEntity.ok(java.util.Map.of("token", token));
            }
            return org.springframework.http.ResponseEntity.status(401).body("No autenticado");
        } catch (AuthenticationException ex) {
            return org.springframework.http.ResponseEntity.status(401).body("No autenticado: " + ex.getMessage());
        }
    }

}
