package com.jouwgamedomein.registratie.controller;

import com.jouwgamedomein.registratie.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    private final UserService userService;

    @Autowired
    public LoginController(UserService userService) {
        this.userService = userService;
    }

    // Endpoint voor het inloggen
    @PostMapping("/api/login")
    public ResponseEntity<String> loginUser(
            @RequestParam("gebruikersnaam") String username, 
            @RequestParam("wachtwoord") String password) {

        if (userService.verifyLogin(username, password)) {
            // In een echte app zou je hier een JWT (token) of Spring Security sessie starten
            return ResponseEntity.ok("🔑 Inloggen succesvol! Welkom terug " + username + ".");
        } else {
            return ResponseEntity.badRequest().body("❌ Ongeldige gebruikersnaam of wachtwoord.");
        }
    }
}
