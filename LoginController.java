// LoginController.java
package com.abelsoftware123.registratie.controller;

import com.abelsoftware123.registratie.dto.LoginRequest;
import com.abelsoftware123.registratie.dto.LoginResponse; // Nieuw DTO!
import com.abelsoftware123.registratie.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    private final UserService userService;

    @Autowired
    public LoginController(UserService userService) {
        this.userService = userService;
    }

    /**
     * POST /api/login: Verwerkt de inlogaanvraag.
     */
    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        try {
            // Roep de UserService aan om de gebruiker te authenticeren en een token te genereren
            String token = userService.authenticateAndGenerateToken(
                request.getUsernameOrEmail(), 
                request.getPassword()
            );

            // Stuur het token terug naar de frontend (script.js)
            return ResponseEntity.ok(new LoginResponse(token, "Inloggen succesvol!"));

        } catch (RuntimeException e) {
            // Authenticatie mislukt (bijv. verkeerd wachtwoord)
            return ResponseEntity.status(401).body(new LoginResponse(null, e.getMessage()));
        }
    }
}
