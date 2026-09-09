package com.abelsoftware123.registratie.controller;

import com.abelsoftware123.registratie.dto.UserProfileDTO;
import com.abelsoftware123.registratie.dto.UpdateProfileRequest;
import com.abelsoftware123.registratie.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;
    // Map waar de foto's worden opgeslagen (zorg dat deze bestaat!)
    private final String UPLOAD_DIR = "uploads/profiles/";

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
            return ResponseEntity.ok(profileData);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Fout bij ophalen profiel.");
        }
    }

    @PostMapping("/update")
    public ResponseEntity<String> updateProfile(
            @RequestPart("data") UpdateProfileRequest request,
            @RequestPart(value = "photo", required = false) MultipartFile file) {
        
        String currentUsername = getCurrentUsername();
        String photoUrl = null;

        try {
            // 1. Foto verwerken als deze is meegestuurd
            if (file != null && !file.isEmpty()) {
                // Maak de map aan als die niet bestaat
                Files.createDirectories(Paths.get(UPLOAD_DIR));
                
                // Unieke bestandsnaam maken om overschrijven te voorkomen
                String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Path path = Paths.get(UPLOAD_DIR + fileName);
                Files.write(path, file.getBytes());
                
                photoUrl = "/uploads/profiles/" + fileName;
            }

            // 2. Gegevens opslaan via de service
            userService.updateUserProfile(currentUsername, request, photoUrl);
            
            return ResponseEntity.ok("✅ Profiel en foto succesvol bijgewerkt!");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("❌ Fout bij opslaan van de foto.");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("❌ Update mislukt: " + e.getMessage());
        }
    }
}
