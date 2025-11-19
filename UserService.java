// UserService.java
package com.abelsoftware123.registratie.service;

import com.abelsoftware123.registratie.dto.UpdateProfileRequest;
import com.abelsoftware123.registratie.dto.UserProfileDTO;
import org.springframework.stereotype.Service;

/**
 * Deze serviceklasse bevat de bedrijfslogica voor het beheren van gebruikers.
 * Het is de schakel tussen de Controllers en de database (waar de placeholders zich bevinden).
 */
@Service
public class UserService {

    // Normaal gesproken zou je hier een UserRepository en PasswordEncoder injecteren.
    // private final UserRepository userRepository;
    // private final PasswordEncoder passwordEncoder; 

    // Omdat we geen @Autowired in de constructor hebben, kunnen we de default gebruiken.

    /**
     * 1. REGISTRATIE: Registreert een nieuwe gebruiker.
     */
    public void registerNewUser(String username, String email, String password) {
        
        // Eenvoudige validatie
        if (username == null || username.length() < 3) {
            throw new RuntimeException("Gebruikersnaam moet minimaal 3 tekens lang zijn.");
        }
        
        // --- START IMPLEMENTATIE: DATABASE LOGICA (VERVANGEN!) ---
        
        // 1. Controleer of de gebruikersnaam of e-mail al bestaat in de DB
        // 2. Hash het wachtwoord: String hashedPassword = passwordEncoder.encode(password);
        // 3. Maak een nieuw Gebruiker object aan en sla het op.
        
        System.out.println("DEBUG: Gebruiker " + username + " succesvol gesimuleerd opgeslagen.");
        
        // --- EINDE IMPLEMENTATIE: DATABASE LOGICA ---
    }


    /**
     * 2. AUTHENTICATIE: Controleert inloggegevens en geeft een token terug.
     */
    public String authenticateAndGenerateToken(String usernameOrEmail, String password) {
        
        // --- START IMPLEMENTATIE: SECURITY LOGICA (VERVANGEN!) ---
        
        // 1. Zoek de gebruiker op in de database via gebruikersnaam of e-mail
        // 2. Controleer het wachtwoord: if (!passwordEncoder.matches(password, user.getHashedPassword()))
        // 3. Genereer een JWT-token: String jwtToken = jwtTokenService.generateToken(user.getUsername());
        
        // Dummy token voor testen:
        if ("testgebruiker".equals(usernameOrEmail) && "testwachtwoord".equals(password)) {
             System.out.println("DEBUG: Inloggen succesvol voor testgebruiker.");
             // Dit is het dummy token dat naar de frontend (script.js) wordt teruggestuurd.
             return "DUMMY_AUTH_TOKEN_VOOR_TESTS"; 
        } else if ("testgebruiker".equals(usernameOrEmail) && !"testwachtwoord".equals(password)) {
             throw new RuntimeException("Onjuist wachtwoord.");
        } else {
             throw new RuntimeException("Gebruiker niet gevonden.");
        }
        
        // --- EINDE IMPLEMENTATIE: SECURITY LOGICA ---
    }


    /**
     * 3. PROFIEL OPHALEN: Haalt de gegevens van een gebruiker op.
     */
    public UserProfileDTO getUserProfile(String username) {
        
        // --- START IMPLEMENTATIE: DATABASE LOGICA (VERVANGEN!) ---
        
        // 1. Zoek de gebruiker op in de database op basis van de gebruikersnaam
        // 2. Vertaal het database-object naar een DTO (om het wachtwoord te verbergen!)
        
        // Dummy data voor test:
        UserProfileDTO dto = new UserProfileDTO();
        dto.setUsername(username);
        dto.setEmail(username + "@testmail.com");
        dto.setFirstName("Abel");
        dto.setLastName("Software");

        return dto;
        
        // --- EINDE IMPLEMENTATIE: DATABASE LOGICA ---
    }

    /**
     * 4. PROFIEL BIJWERKEN: Slaat de gewijzigde profielgegevens op.
     */
    public void updateUserProfile(String username, UpdateProfileRequest request) {
        
        // --- START IMPLEMENTATIE: DATABASE LOGICA (VERVANGEN!) ---
        
        // 1. Zoek de bestaande gebruiker in de database
        // 2. Werk de velden bij: user.setEmail(request.getEmail()), etc.
        // 3. Indien wachtwoord wijziging: Hash het en sla het op.
        // 4. Sla de wijzigingen op: userRepository.save(user);

        System.out.println("DEBUG: Profiel van " + username + " gesimuleerd bijgewerkt.");
        
        // --- EINDE IMPLEMENTATIE: DATABASE LOGICA ---
    }
}
