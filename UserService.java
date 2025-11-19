// UserService.java
package com.abelsoftware123.registratie.service;

import com.abelsoftware123.registratie.dto.UpdateProfileRequest;
import com.abelsoftware123.registratie.dto.UserProfileDTO;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    // Normaal gesproken zou je hier een UserRepository injecteren.
    
    /**
     * 1. REGISTRATIE: Registreert een nieuwe gebruiker.
     */
    public void registerNewUser(String username, String email, String password) {
        
        if (username.length() < 3) {
            throw new RuntimeException("Gebruikersnaam moet minimaal 3 tekens lang zijn.");
        }
        
        // --- START IMPLEMENTATIE: DATABASE LOGICA (VERVANGEN!) ---
        // 1. Controleer of de gebruiker al bestaat
        // 2. Hash het wachtwoord: String hashedPassword = passwordEncoder.encode(password);
        // 3. Sla de nieuwe gebruiker op in de database
        System.out.println("DEBUG: Gebruiker " + username + " succesvol gesimuleerd opgeslagen.");
        // --- EINDE IMPLEMENTATIE: DATABASE LOGICA ---
    }


    /**
     * 2. PROFIEL OPHALEN: Haalt de gegevens van een gebruiker op.
     */
    public UserProfileDTO getUserProfile(String username) {
        
        // --- START IMPLEMENTATIE: DATABASE LOGICA (VERVANGEN!) ---
        // 1. Zoek de gebruiker op in de database op basis van de gebruikersnaam
        
        // Dummy data (voor testen):
        UserProfileDTO dto = new UserProfileDTO();
        dto.setUsername(username);
        dto.setEmail(username + "@testmail.com");
        dto.setFirstName("Abel");
        dto.setLastName("Software");

        return dto;
        
        // --- EINDE IMPLEMENTATIE: DATABASE LOGICA ---
    }

    /**
     * 3. PROFIEL BIJWERKEN: Slaat de gewijzigde profielgegevens op.
     */
    public void updateUserProfile(String username, UpdateProfileRequest request) {
        
        // --- START IMPLEMENTATIE: DATABASE LOGICA (VERVANGEN!) ---
        // 1. Zoek de bestaande gebruiker in de database
        // 2. Werk de velden bij (email, firstName, lastName)
        // 3. Indien request.getNewPassword() niet leeg is: Hash en sla het nieuwe wachtwoord op.
        // 4. Sla de wijzigingen op in de database.

        System.out.println("DEBUG: Profiel van " + username + " gesimuleerd bijgewerkt.");
        
        // --- EINDE IMPLEMENTATIE: DATABASE LOGICA ---
    }
}
