package com.abelsoftware123.registration.controller;

import com.abelsoftware123.registration.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller for handling user login requests.
 */
@RestController
public class LoginController {

    private final UserService userService;

    @Autowired
    public LoginController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Endpoint for user login.
     * Maps POST requests to /api/login and verifies user credentials.
     *
     * @param username The user's username (expected from the form field 'username').
     * @param password The user's password (expected from the form field 'password').
     * @return A ResponseEntity indicating the result of the login attempt.
     */
    @PostMapping("/api/login")
    public ResponseEntity<String> loginUser(
            @RequestParam("username") String username, 
            @RequestParam("password") String password) {

        if (userService.verifyLogin(username, password)) {
            // In a real application, you would start a JWT (token) or Spring Security session here
            return ResponseEntity.ok("🔑 Login successful! Welcome back " + username + ".");
        } else {
            return ResponseEntity.badRequest().body("❌ Invalid username or password.");
        }
    }
}

