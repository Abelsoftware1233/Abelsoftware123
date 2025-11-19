// ProfileController.java
package com.abelsoftware123.registratie.controller;

import com.abelsoftware123.registratie.dto.UserProfileDTO; // Nodig om gebruikersgegevens terug te geven
import com.abelsoftware123.registratie.dto.UpdateProfileRequest; // Nodig om update-gegevens te ontvangen
import com.abelsoftware123.registratie.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile") // Alle methoden beginnen met /api/profile
public class ProfileController {

    private final UserService userService;

    @Autowired
    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 1. GET /api/profile
     * Haalt de gegevens van de ingelogde gebruiker op.
     */
    @GetMapping 
    public ResponseEntity<?> getProfile() {
        // --- START PLAATSVERVANGENDE LOGICA ---
        // In een echte applicatie zou je hier Spring Security gebruiken om de ingelogde gebruiker te vinden.
        // Bijv: String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        String currentUsername = "HUIDIGE_INGELOGDE_GEBRUIKER"; // Placeholder
        // --- EINDE PLAATSVERVANGENDE LOGICA ---

        try {
            // Haal de volledige profielgegevens op uit de database
            UserProfileDTO profileData = userService.getUserProfile(currentUsername);

            if (profileData == null) {
                return ResponseEntity.status(404).body("Gebruiker niet gevonden.");
            }
            
            // Geef de gegevens als JSON terug aan de frontend (script.js)
            return ResponseEntity.ok(profileData);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Fout bij het ophalen van het profiel: " + e.getMessage());
        }
    }

    /**
     * 2. POST /api/profile/update
     * Slaat de gewijzigde profielgegevens op.
     */
    @PostMapping("/update") // Wordt /api/profile/update
    public ResponseEntity<String> updateProfile(@RequestBody UpdateProfileRequest request) {
        // --- START PLAATSVERVANGENDE LOGICA ---
        String currentUsername = "HUIDIGE_INGELOGDE_GEBRUIKER"; // Placeholder
        // --- EINDE PLAATSVERVANGENDE LOGICA ---
        
        // Optionele basis validatie
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body("E-mail mag niet leeg zijn.");
        }

        try {
            // Roep de UserService aan om de gegevens op te slaan
            userService.updateUserProfile(currentUsername, request);

            return ResponseEntity.ok("✅ Profiel succesvol bijgewerkt!");

        } catch (RuntimeException e) {
            // Fout bij het opslaan (bijv. e-mail is al in gebruik)
            return ResponseEntity.status(400).body("❌ Update mislukt: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Interne serverfout bij opslaan.");
        }
    }
}
