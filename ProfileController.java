// ProfileController.java
package com.abelsoftware123.registratie.controller;

import com.abelsoftware123.registratie.dto.UserProfileDTO;
import com.abelsoftware123.registratie.dto.UpdateProfileRequest;
import com.abelsoftware123.registratie.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;

    @Autowired
    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    // 1. GET /api/profile
    @GetMapping 
    public ResponseEntity<?> getProfile() {
        // Vang de gebruikersnaam op na inloggen (vervang deze placeholder)
        String currentUsername = "HUIDIGE_INGELOGDE_GEBRUIKER"; 

        try {
            UserProfileDTO profileData = userService.getUserProfile(currentUsername);

            if (profileData == null) {
                return ResponseEntity.status(404).body("Gebruiker niet gevonden.");
            }
            
            return ResponseEntity.ok(profileData);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Fout bij het ophalen van het profiel: " + e.getMessage());
        }
    }

    // 2. POST /api/profile/update
    @PostMapping("/update")
    public ResponseEntity<String> updateProfile(@RequestBody UpdateProfileRequest request) {
        String currentUsername = "HUIDIGE_INGELOGDE_GEBRUIKER"; // Vervang deze placeholder
        
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body("E-mail mag niet leeg zijn.");
        }

        try {
            userService.updateUserProfile(currentUsername, request);

            return ResponseEntity.ok("✅ Profiel succesvol bijgewerkt!");

        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body("❌ Update mislukt: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Interne serverfout bij opslaan.");
        }
    }
}
