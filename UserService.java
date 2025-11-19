// UserService.java
package com.abelsoftware123.registratie.service;

import com.abelsoftware123.registratie.dto.UpdateProfileRequest;
import com.abelsoftware123.registratie.dto.UserProfileDTO;
import com.abelsoftware123.registratie.model.User;
import com.abelsoftware123.registratie.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    // Injecteer de Repository en de PasswordEncoder
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * 1. REGISTRATIE: Registreert een nieuwe gebruiker.
     */
    public void registerNewUser(String username, String email, String password) {
        
        if (username == null || username.length() < 3 || password == null || password.length() < 8) {
            throw new RuntimeException("Gebruikersnaam moet minimaal 3 tekens zijn en wachtwoord minimaal 8.");
        }
        
        // Controleer of de gebruiker al bestaat
        if (userRepository.existsByUsernameOrEmail(username, email)) {
            throw new RuntimeException("Deze gebruikersnaam of dit e-mailadres is al in gebruik.");
        }
        
        // Wachtwoord hashen
        String hashedPassword = passwordEncoder.encode(password);
        
        // Nieuwe User entiteit aanmaken en opslaan
        User newUser = new User(username, email, hashedPassword);
        userRepository.save(newUser);
        
        System.out.println("LOG: Gebruiker " + username + " succesvol geregistreerd.");
    }

    /**
     * 2. AUTHENTICATIE: Controleert inloggegevens.
     * NB: In een echte Spring Security app zou dit in een aparte service zitten,
     * maar voor jouw flow is dit de meest directe oplossing.
     */
    public String authenticateAndGenerateToken(String usernameOrEmail, String password) {
        
        // Zoek de gebruiker op via gebruikersnaam of e-mail
        Optional<User> userOptional = userRepository.findByUsername(usernameOrEmail)
                                                .or(() -> userRepository.findByEmail(usernameOrEmail));

        User user = userOptional.orElseThrow(() -> new RuntimeException("Gebruiker niet gevonden."));
        
        // Controleer het gehashte wachtwoord
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Onjuist wachtwoord.");
        }
        
        // Hier zou je een ECHTE JWT-token genereren.
        // Omdat we de JWT-generatie service niet hebben, geven we een testtoken terug.
        String jwtToken = "TEST_JWT_" + user.getUsername() + "_" + System.currentTimeMillis(); 
        
        System.out.println("LOG: Gebruiker " + user.getUsername() + " succesvol ingelogd.");
        return jwtToken;
    }

    /**
     * 3. PROFIEL OPHALEN: Haalt de gegevens van een gebruiker op.
     */
    public UserProfileDTO getUserProfile(String username) {
        
        // Zoek de gebruiker op basis van de beveiligde gebruikersnaam
        User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("Profiel niet gevonden na authenticatie."));
        
        // Vertaal de User entiteit naar een DTO voor de frontend
        UserProfileDTO dto = new UserProfileDTO();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());

        return dto;
    }

    /**
     * 4. PROFIEL BIJWERKEN: Slaat de gewijzigde profielgegevens op.
     */
    public void updateUserProfile(String username, UpdateProfileRequest request) {
        
        User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("Gebruiker niet gevonden voor update."));
        
        // Update de velden
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        // Wachtwoord bijwerken, indien gevraagd
        if (request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
            if (request.getNewPassword().length() < 8) {
                 throw new RuntimeException("Nieuw wachtwoord moet minimaal 8 tekens lang zijn.");
            }
            String newHashedPassword = passwordEncoder.encode(request.getNewPassword());
            user.setPassword(newHashedPassword);
        }
        
        // Sla de wijzigingen op in de database
        userRepository.save(user);

        System.out.println("LOG: Profiel van " + username + " succesvol bijgewerkt.");
    }
}
