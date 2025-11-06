package com.jouwgamedomein.registratie.controller;

import com.jouwgamedomein.registratie.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RegistrationController {

    private final UserService userService;

    @Autowired
    public RegistrationController(UserService userService) {
        this.userService = userService;
    }

    // Dit is het endpoint dat het HTML formulier aanroept (action="/api/registreer")
    @PostMapping("/api/registreer")
    public ResponseEntity<String> registerUser(
            @RequestParam("gebruikersnaam") String username, 
            @RequestParam("email") String email,
            @RequestParam("wachtwoord") String password) { // 'wachtwoord' is de naam van het input veld

        try {
            userService.registerNewUser(username, email, password);
            return ResponseEntity.ok("✅ Registratie succesvol! Je kunt nu inloggen.");
        } catch (RuntimeException e) {
            // Geeft de foutmelding (bijv. "Gebruikersnaam bestaat al") terug aan de gebruiker
            return ResponseEntity.badRequest().body("❌ Registratie mislukt: " + e.getMessage());
        }
    }
}
