// ProfileController.java
package com.abelsoftware123.registration.controller;

import com.abelsoftware123.registration.model.User; // Zorg dat dit pad klopt!
import com.abelsoftware123.registration.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile") // Basispad voor profiel API
public class ProfileController {

    @Autowired
    private UserService userService;
    
    // Zorg ervoor dat de ProfileUpdateRequest klasse bestaat in dezelfde map of correct is geïmporteerd.

    /**
     * Endpoint 1: Haalt de profielgegevens van de ingelogde gebruiker op. (GET /api/profile/me)
     */
    @GetMapping("/me")
    public ResponseEntity<ProfileUpdateRequest> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        // Gebruik de username van de beveiligde context om de gebruiker te vinden
        User user = userService.findByUsername(userDetails.getUsername());
        
        // Converteer de User Entity naar het DTO-formaat dat de frontend verwacht
        ProfileUpdateRequest responseDto = new ProfileUpdateRequest();
        responseDto.setEmail(user.getEmail());
        responseDto.setFirstName(user.getFirstName()); // Vereist dat deze velden bestaan in je User.java
        responseDto.setLastName(user.getLastName());
        
        // Stuur geen wachtwoorden terug!
        
        return ResponseEntity.ok(responseDto);
    }

    /**
     * Endpoint 2: Werkt de profielgegevens van de ingelogde gebruiker bij. (POST /api/profile/update)
     */
    @PostMapping("/update")
    public ResponseEntity<String> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails, 
            @RequestBody ProfileUpdateRequest request) { // Ontvangt JSON body van de frontend
        
        // 1. Zoek de bestaande gebruiker
        User existingUser = userService.findByUsername(userDetails.getUsername());

        // 2. Valideer de wachtwoorden aan de backend (veiligheidscheck)
        if (request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                return ResponseEntity.badRequest().body("New passwords do not match!");
            }
            // Roep de service aan om alleen het wachtwoord bij te werken (hash!)
            userService.updatePassword(existingUser, request.getNewPassword());
        }

        // 3. Werk de andere velden bij
        existingUser.setEmail(request.getEmail());
        existingUser.setFirstName(request.getFirstName());
        existingUser.setLastName(request.getLastName());

        // 4. Sla de bijgewerkte gebruiker op
        userService.save(existingUser);

        return ResponseEntity.ok("Profile successfully updated!");
    }
}
