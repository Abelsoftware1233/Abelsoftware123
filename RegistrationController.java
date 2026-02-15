package com.abelsoftware123.registratie.controller;

import com.abelsoftware123.registratie.dto.RegistrationRequest;
import com.abelsoftware123.registratie.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller; // Veranderd van RestController naar Controller
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ModelAttribute; // Belangrijk voor formulieren
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RegistrationController {

    private final UserService userService;

    @Autowired
    public RegistrationController(UserService userService) {
        this.userService = userService;
    }

    // Dit zorgt dat het formulier uit de HTML wordt verwerkt
    @PostMapping("/register") 
    public String registerUser(@ModelAttribute RegistrationRequest request) {
        
        try {
            userService.registerNewUser(
                request.getUsername(), 
                request.getEmail(), 
                request.getPassword()
            );
            
            // NA REGISTRATIE: Stuur direct door naar de profielpagina
            return "redirect:/profile"; 
            
        } catch (RuntimeException e) {
            // Bij een fout: ga terug naar de registreerpagina met een foutmelding
            return "redirect:/registreer.html?error=" + e.getMessage();
        }
    }

    // DIT ONTBRAK: De route die de profielpagina daadwerkelijk opent
    @GetMapping("/profile")
    public String showProfilePage() {
        return "profile"; // Dit zoekt naar profile.html
    }
}
