// RegistrationController.java
package com.abelsoftware123.registratie.controller;

import com.abelsoftware123.registratie.request.RegistrationRequest;
import com.abelsoftware123.registratie.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RegistrationController {

    private final UserService userService;

    @Autowired
    public RegistrationController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Verwerkt de POST-aanvraag van het registratieformulier op /api/register.
     */
    @PostMapping("/api/register") 
    public ResponseEntity<String> registerUser(@RequestBody RegistrationRequest request) {
        
        // Simpele validatie
        if (request.getUsername() == null || request.getPassword() == null || request.getEmail() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body("❌ Alle velden (Gebruikersnaam, E-mail, Wachtwoord) zijn verplicht.");
        }

        try {
            // Roep de UserService aan om de gebruiker op te slaan
            userService.registerNewUser(
                request.getUsername(), 
                request.getEmail(), 
                request.getPassword()
            );
            
            // ✅ SUCCES: Geeft een OK-status terug
            return ResponseEntity.ok("✅ Registratie succesvol! U wordt doorgestuurd naar de login pagina.");
            
        } catch (RuntimeException e) {
            // ❌ FOUT: Geeft een Bad Request status terug met de foutmelding
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body("❌ Registratie mislukt: " + e.getMessage());
        }
    }
}
