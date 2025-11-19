// RegistrationController.java
package com.abelsoftware123.registratie.controller;

import com.abelsoftware123.registratie.request.RegistrationRequest; // Zorg dat dit pad klopt!
import com.abelsoftware123.registratie.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; // Voor het teruggeven van de juiste HTTP status
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Deze controller handelt registratieaanvragen af.
 * Het luistert naar een POST-verzoek op de URL /api/register.
 */
@RestController
public class RegistrationController {

    // De UserService is nodig om de nieuwe gebruiker in de database op te slaan
    private final UserService userService;

    @Autowired
    public RegistrationController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Verwerkt de POST-aanvraag van het registratieformulier.
     * * @param request De gegevens van het registratieformulier (Username, Email, Password).
     * @return Een succesbericht (HTTP 200 OK) of een foutbericht (HTTP 400 Bad Request).
     */
    @PostMapping("/api/register") // <-- Dit is de URL en de Methode (POST) die je nodig hebt!
    public ResponseEntity<String> registerUser(@RequestBody RegistrationRequest request) {
        
        // Simpele validatie
        if (request.getUsername() == null || request.getPassword() == null || request.getEmail() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body("❌ Registratie mislukt: Alle velden (Gebruikersnaam, E-mail, Wachtwoord) zijn verplicht.");
        }

        try {
            // Roep de UserService aan om de gebruiker op te slaan
            userService.registerNewUser(
                request.getUsername(), 
                request.getEmail(), 
                request.getPassword()
            );
            
            // Registratie is succesvol!
            return ResponseEntity.ok("✅ Registratie succesvol! Je kunt nu inloggen.");
            
        } catch (RuntimeException e) {
            // Er is iets misgegaan (bijvoorbeeld: gebruiker bestaat al)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body("❌ Registratie mislukt: " + e.getMessage());
        }
    }
}
