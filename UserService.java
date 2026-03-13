package com.abelsoftware123.registratie.service;

import com.abelsoftware123.registratie.dto.UpdateProfileRequest;
import com.abelsoftware123.registratie.dto.UserProfileDTO;
import com.abelsoftware123.registratie.model.User;
import com.abelsoftware123.registratie.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * 1. REGISTRATIE
     */
    public void registerNewUser(String username, String email, String password) {
        if (username == null || username.length() < 3 || password == null || password.length() < 8) {
            throw new RuntimeException("Gebruikersnaam min. 3 tekens, wachtwoord min. 8.");
        }
        
        if (userRepository.findByUsername(username).isPresent() || userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Gebruikersnaam of e-mail al in gebruik.");
        }
        
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setEmail(email);
        newUser.setPasswordHash(passwordEncoder.encode(password));
        newUser.setRole("ROLE_USER"); 
        
        userRepository.save(newUser);
    }

    /**
     * 2. ALLE GEBRUIKERS OPHALEN
     */
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    /**
     * 3. GEBRUIKER VERWIJDEREN
     */
    public void deleteUserById(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Gebruiker niet gevonden.");
        }
        userRepository.deleteById(id);
    }

    /**
     * 4. PROFIEL OPHALEN (Inclusief Foto URL)
     */
    public UserProfileDTO getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("Profiel niet gevonden."));
        
        UserProfileDTO dto = new UserProfileDTO();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setProfilePictureUrl(user.getProfilePictureUrl()); // Zorg dat dit in je DTO staat!
        return dto;
    }

    /**
     * 5. PROFIEL BIJWERKEN (Nu met Foto ondersteuning)
     */
    public void updateUserProfile(String username, UpdateProfileRequest request, String photoUrl) {
        User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("Gebruiker niet gevonden."));
        
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        // Alleen de foto bijwerken als er een nieuwe is geüpload
        if (photoUrl != null) {
            user.setProfilePictureUrl(photoUrl);
        }

        // Wachtwoord alleen bijwerken als het veld is ingevuld
        if (request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
            if (request.getNewPassword().length() < 8) {
                 throw new RuntimeException("Nieuw wachtwoord moet minimaal 8 tekens lang zijn.");
            }
            user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        }
        
        userRepository.save(user);
    }
}
