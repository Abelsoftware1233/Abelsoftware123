package com.abelsoftware123.registratie.controller;

import com.abelsoftware123.registratie.dto.RegistrationRequest;
import com.abelsoftware123.registratie.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class RegistrationController {

    private final UserService userService;

    @Autowired
    public RegistrationController(UserService userService) {
        this.userService = userService;
    }

    // Laat de registratiepagina zien
    @GetMapping("/registreer")
    public String showRegistrationPage() {
        return "registreer"; 
    }

    // Verwerk de registratie en stuur door naar profiel
    @PostMapping("/register") 
    public String registerUser(@ModelAttribute RegistrationRequest request) {
        try {
            userService.registerNewUser(
                request.getUsername(), 
                request.getEmail(), 
                request.getPassword()
            );
            // Dit is de fix voor je "Page Not Found":
            return "redirect:/profile"; 
            
        } catch (RuntimeException e) {
            return "redirect:/registreer.html?error=" + e.getMessage();
        }
    }

    // DIT IS ESSENTIEEL: De route die de HTML pagina 'profile.html' opent
    @GetMapping("/profile")
    public String showProfilePage() {
        return "profile"; 
    }
}
