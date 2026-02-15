package com.abelsoftware123.registratie.controller;

import com.abelsoftware123.registratie.dto.UserProfileDTO;
import com.abelsoftware123.registratie.dto.UpdateProfileRequest;
import com.abelsoftware123.registratie.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;

    @Autowired
    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    private String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName(); 
    }

    @GetMapping 
    public ResponseEntity<?> getProfile() {
        String currentUsername = getCurrentUsername(); 
        try {
            UserProfileDTO profileData = userService.getUserProfile(currentUsername);
            if (profileData == null) {
                return ResponseEntity.status(404).body("Gebruiker niet gevonden.");
            }
            return ResponseEntity.ok(profileData);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Fout bij ophalen profiel.");
        }
    }

    @PostMapping("/update")
    public ResponseEntity<String> updateProfile(@RequestBody UpdateProfileRequest request) {
        String currentUsername = getCurrentUsername();
        try {
            userService.updateUserProfile(currentUsername, request);
            return ResponseEntity.ok("✅ Profiel succesvol bijgewerkt!");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("❌ Update mislukt: " + e.getMessage());
        }
    }
}
