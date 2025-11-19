// RegistrationController.java
package com.abelsoftware123.registratie.controller;

import com.abelsoftware123.registratie.dto.RegistrationRequest;
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

    @PostMapping("/api/register") 
    public ResponseEntity<String> registerUser(@RequestBody RegistrationRequest request) {
        
        if (request.getUsername() == null || request.getPassword() == null || request.getEmail() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body("❌ Alle velden (Gebruikersnaam, E-mail, Wachtwoord) zijn verplicht.");
        }

        try {
            userService.registerNewUser(
                request.getUsername(), 
                request.getEmail(), 
                request.getPassword()
            );
            
            return ResponseEntity.ok("✅ Registratie succesvol! U wordt doorgestuurd naar de login pagina.");
            
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body("❌ Registratie mislukt: " + e.getMessage());
        }
    }
}
