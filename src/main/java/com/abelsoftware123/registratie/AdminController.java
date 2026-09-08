package com.abelsoftware123.registratie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;

    @Autowired
    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAllUsers());
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> request) {
        try {
            userService.createUserByAdmin(
                request.get("username"),
                request.get("email"),
                request.get("password"),
                request.get("role")
            );
            return ResponseEntity.ok(Map.of("message", "Gebruiker aangemaakt."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            userService.updateUserByAdmin(
                id,
                request.get("username"),
                request.get("email"),
                request.get("role")
            );
            return ResponseEntity.ok(Map.of("message", "Gebruiker bijgewerkt."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUserById(id);
            return ResponseEntity.ok(Map.of("message", "Gebruiker verwijderd."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/users/{id}/reset-password")
    public ResponseEntity<?> resetPassword(@PathVariable Long id) {
        try {
            String newPassword = userService.resetPassword(id);
            return ResponseEntity.ok(Map.of("newPassword", newPassword));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
