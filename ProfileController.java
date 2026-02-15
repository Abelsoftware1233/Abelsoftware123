// ProfileController.java
package com.abelsoftware123.registratie.controller;

import com.abelsoftware123.registratie.dto.UserProfileDTO;
import com.abelsoftware123.registratie.dto.UpdateProfileRequest;
import com.abelsoftware123.registratie.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder; // Belangrijke import!
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;

    @Autowired
    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    // Functie om de gebruikersnaam van de ingelogde gebruiker op te halen
    private String getCurrentUsername() {
        // Haalt de gebruikersnaam op uit het token dat door Spring Security is gevalideerd
        return SecurityContextHolder.getContext().getAuthentication().getName(); 
    }

    /**
     * 1. GET /api/profile
     */
    @GetMapping 
    public ResponseEntity<?> getProfile() {
        
        String currentUsername = getCurrentUsername(); 

        try {
            UserProfileDTO profileData = userService.getUserProfile(currentUsername);

            if (profileData == null) {
                return ResponseEntity.status(404).body("Gebruiker niet gevonden.");
            }
            
            return ResponseEntity.ok(profileData);

        } catch (RuntimeException e) { // Vang de fouten op uit de UserService
             return ResponseEntity.status(400).body("Fout: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Interne serverfout.");
        }
    }

    /**
     * 2. POST /api/profile/update
     */
    @PostMapping("/update")
    public ResponseEntity<String> updateProfile(@RequestBody UpdateProfileRequest request) {
        String currentUsername = getCurrentUsername();
        
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
package com.abelsoftware123.registratie.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController // Gebruik RestController voor API/JSON data
@RequestMapping("/api/profile")
public class ProfileController {

    @GetMapping
    public ResponseEntity<?> getProfile() {
        // Hier haal je de data uit de database
        // Voor nu een test-object:
        return ResponseEntity.ok(new UserData("Gebruikersnaam", "email@test.com"));
    }

    @PostMapping("/update")
    public ResponseEntity<String> updateProfile(@RequestBody UpdateProfileRequest request) {
        // Hier sla je de data op
        return ResponseEntity.ok("Profiel bijgewerkt!");
    }
}
