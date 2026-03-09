package com.abelsoftware123.registratie.controller;

import com.abelsoftware123.registratie.dto.UserProfileDTO;
import com.abelsoftware123.registratie.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller // Let op: geen @RestController, want we sturen HTML terug
public class ViewController {

    private final UserService userService;

    public ViewController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profiel")
    public String showProfilePage(Model model, Authentication authentication) {
        // Haal de gegevens van de ingelogde gebruiker op
        String currentUsername = authentication.getName();
        UserProfileDTO profile = userService.getUserProfile(currentUsername);

        // Geef de username door aan profiel.html (voor th:text="${username}")
        model.addAttribute("username", profile.getUsername());
        model.addAttribute("email", profile.getEmail());

        return "profiel"; // Verwijst naar src/main/resources/templates/profiel.html
    }

    @GetMapping("/login.html")
    public String login() {
        return "login";
    }

    @GetMapping("/register.html")
    public String register() {
        return "register";
    }
}
