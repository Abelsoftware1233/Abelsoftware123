// UserService.java
package com.abelsoftware123.registratie.service;

import com.abelsoftware123.registratie.dto.RegistrationRequest;
import com.abelsoftware123.registratie.dto.UpdateProfileRequest;
import com.abelsoftware123.registratie.dto.UserProfileDTO;
import org.springframework.stereotype.Service;

/**
 * Deze serviceklasse bevat de bedrijfslogica voor het beheren van gebruikers.
 * Het is de schakel tussen de Controllers en de database.
 */
@Service
public class UserService {

    // Normaal gesproken zou je hier een UserRepository of vergelijkbaar injecteren.
    // private final UserRepository userRepository;
    // private final PasswordEncoder passwordEncoder; // Voor het hashen van wachtwoorden
    
    // @Autowired
    // public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    //     this.userRepository = userRepository;
    //     this.passwordEncoder = passwordEncoder;
    // }

    /**
     * 1. REGISTRATIE: Registreert een nieuwe gebruiker.
     * Wordt aangeroepen door RegistrationController.
     */
    public void registerNewUser(String username, String email, String password) {
        
        // Eenvoudige validatie
        if (username.length() < 3) {
            throw new RuntimeException("Gebruikersnaam moet minimaal 3 tekens lang zijn.");
        }
        
        // --- START IMPLEMENTATIE: DATABASE LOGICA ---
        
        // 1. Controleer of de gebruikersnaam of e-mail al bestaat
        // if (userRepository.existsByUsernameOrEmail(username, email)) {
        //     throw new RuntimeException("Deze gebruikersnaam of dit e-mailadres is al in gebruik.");
        // }
        
        // 2. Hash het wachtwoord voordat je het opslaat
        // String hashedPassword = passwordEncoder.encode(password);
        
        // 3. Maak een nieuw Gebruiker object aan en sla het op in de database
        // User newUser = new User(username, email, hashedPassword);
        // userRepository.save(newUser);
        
        System.out.println("DEBUG: Gebruiker " + username + " succesvol geregistreerd in de (gesimuleerde) database.");
        
        // --- EINDE IMPLEMENTATIE: DATABASE LOGICA ---
    }


    /**
     * 2. PROFIEL OPHALEN: Haalt de gegevens van een gebruiker op.
     * Wordt aangeroepen door ProfileController.
     */
    public UserProfileDTO getUserProfile(String username) {
        
        // --- START IMPLEMENTATIE: DATABASE LOGICA ---
        
        // 1. Zoek de gebruiker op in de database op basis van de gebruikersnaam
        // User user = userRepository.findByUsername(username).orElse(null);
        
        // if (user == null) {
        //     return null; // Gebruiker niet gevonden
        // }
        
        // 2. Vertaal het database-object naar een DTO (om het wachtwoord te verbergen!)
        UserProfileDTO dto = new UserProfileDTO();
        dto.setUsername(username);
        // dto.setEmail(user.getEmail());
        // dto.setFirstName(user.getFirstName());
        // dto.setLastName(user.getLastName());
        
        // Dummy data voor test:
        dto.setEmail(username + "@testmail.com");
        dto.setFirstName("Abel");
        dto.setLastName("Software");

        return dto;
        
        // --- EINDE IMPLEMENTATIE: DATABASE LOGICA ---
    }

    /**
     * 3. PROFIEL BIJWERKEN: Slaat de gewijzigde profielgegevens op.
     * Wordt aangeroepen door ProfileController.
     */
    public void updateUserProfile(String username, UpdateProfileRequest request) {
        
        // --- START IMPLEMENTATIE: DATABASE LOGICA ---
        
        // 1. Zoek de bestaande gebruiker in de database
        // User user = userRepository.findByUsername(username)
        //                           .orElseThrow(() -> new RuntimeException("Gebruiker niet gevonden voor update."));
        
        // 2. Werk de velden bij
        // user.setEmail(request.getEmail());
        // user.setFirstName(request.getFirstName());
        // user.setLastName(request.getLastName());

        // 3. Wachtwoord bijwerken, indien gevraagd
        // if (request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
        //     String newHashedPassword = passwordEncoder.encode(request.getNewPassword());
        //     user.setPassword(newHashedPassword);
        // }
        
        // 4. Sla de wijzigingen op
        // userRepository.save(user);

        System.out.println("DEBUG: Profiel van " + username + " succesvol bijgewerkt met nieuw e-mail: " + request.getEmail());
        
        // --- EINDE IMPLEMENTATIE: DATABASE LOGICA ---
    }
}
