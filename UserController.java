package com.abelsoftware123.registratie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            userService.registerNewUser(
                request.get("username"),
                request.get("email"),
                request.get("password")
            );
            return ResponseEntity.ok(Map.of("message", "Account aangemaakt."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Niet ingelogd."));
        }
        try {
            UserProfileDTO profile = userService.getUserProfile(userDetails.getUsername());
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/user/profile")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                            @RequestBody UpdateProfileRequest request) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Niet ingelogd."));
        }
        try {
            userService.updateUserProfile(userDetails.getUsername(), request);
            return ResponseEntity.ok(Map.of("message", "Profiel bijgewerkt."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}