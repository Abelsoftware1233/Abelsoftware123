// RegistrationController.java
package com.abelsoftware123.registratie.controller;

import com.abelsoftware123.registratie.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody; // <-- Nieuwe Import
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RegistrationController {

    private final UserService userService;

    @Autowired
    public RegistrationController(UserService userService) {
        this.userService = userService;
    }

    // Aangepast om:
    // 1. Te luisteren naar /api/register (komt overeen met de HTML form action)
    // 2. JSON data te ontvangen via @RequestBody
    @PostMapping("/api/register")
    public ResponseEntity<String> registerUser(
            @RequestBody RegistrationRequest request) { // Ontvangt JSON als een Request object

        try {
            // Roep de UserService aan met de gegevens uit het Request object
            userService.registerNewUser(request.getUsername(), request.getEmail(), request.getPassword());
            return ResponseEntity.ok("✅ Registratie succesvol! Je kunt nu inloggen.");
        } catch (RuntimeException e) {
            // Geeft de foutmelding terug als een slechte aanvraag (HTTP 400)
            return ResponseEntity.badRequest().body("❌ Registratie mislukt: " + e.getMessage());
        }
    }
}
