package com.abelsoftware123.registratie.controller;

import com.abelsoftware123.registratie.dto.UpdateProfileRequest;
import com.abelsoftware123.registratie.dto.UserProfileDTO;
import com.abelsoftware123.registratie.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Registratie endpoint voor de 'registreer.html'
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> request) {
        try {
            userService.registerNewUser(
                request.get("username"),
                request.get("email"),
                request.get("password")
            );
            return ResponseEntity.ok(Map.of("message", "Registratie succesvol!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Profiel ophalen voor de 'profiel.html'
     * Spring Security vult de @AuthenticationPrincipal automatisch in na login.
     */
    @GetMapping("/user/profile")
    public ResponseEntity<UserProfileDTO> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        UserProfileDTO profile = userService.getUserProfile(userDetails.getUsername());
        return ResponseEntity.ok(profile);
    }

    /**
     * Profiel bijwerken
     */
    @PutMapping("/user/profile")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserDetails userDetails, 
                                          @RequestBody UpdateProfileRequest request) {
        try {
            userService.updateUserProfile(userDetails.getUsername(), request);
            return ResponseEntity.ok(Map.of("message", "Profiel succesvol bijgewerkt!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
