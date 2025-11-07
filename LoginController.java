// LoginController.java
package com.abelsoftware123.registration.controller;

import com.abelsoftware123.registration.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody; // Cruciale import
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
     * Maps POST requests to /api/login and verifies user credentials using JSON data.
     */
    @PostMapping("/api/login")
    public ResponseEntity<String> loginUser(
            @RequestBody LoginRequest request) { // Ontvangt JSON body

        // Gebruik de gegevens uit het Request object
        if (userService.verifyLogin(request.getUsername(), request.getPassword())) {
            // Success: Stuur een token of succesboodschap
            return ResponseEntity.ok("🔑 Login successful! Welcome back " + request.getUsername() + ".");
        } else {
            // Failure
            return ResponseEntity.badRequest().body("❌ Invalid username or password.");
        }
    }
}
