package com.abelsoftware123.registratie.controller;

import com.abelsoftware123.registratie.dto.*;
import com.abelsoftware123.registratie.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 1. REGISTREREN: POST http://localhost:8080/api/users/register
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Map<String, String> payload) {
        userService.registerNewUser(
            payload.get("username"), 
            payload.get("email"), 
            payload.get("password")
        );
        return ResponseEntity.ok("Gebruiker succesvol geregistreerd!");
    }

    // 2. INLOGGEN: POST http://localhost:8080/api/users/login
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> payload) {
        String token = userService.authenticateAndGenerateToken(
            payload.get("usernameOrEmail"), 
            payload.get("password")
        );
        return ResponseEntity.ok(token);
    }

    // 3. PROFIEL OPHALEN: GET http://localhost:8080/api/users/profile/{username}
    @GetMapping("/profile/{username}")
    public ResponseEntity<UserProfileDTO> getProfile(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserProfile(username));
    }

    // 4. PROFIEL UPDATE: PUT http://localhost:8080/api/users/profile/{username}
    @PutMapping("/profile/{username}")
    public ResponseEntity<String> updateProfile(
            @PathVariable String username, 
            @RequestBody UpdateProfileRequest request) {
        userService.updateUserProfile(username, request);
        return ResponseEntity.ok("Profiel succesvol bijgewerkt!");
    }
}
