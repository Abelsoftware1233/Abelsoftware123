package com.abelsoftware123.registratie.service;

import com.abelsoftware123.registratie.dto.UpdateProfileRequest;
import com.abelsoftware123.registratie.dto.UserProfileDTO;
import com.abelsoftware123.registratie.model.User;
import com.abelsoftware123.registratie.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
     * 1. REGISTRATIE: Registreert een nieuwe gebruiker met password hashing.
     */
    public void registerNewUser(String username, String email, String password) {
        if (username == null || username.length() < 3 || password == null || password.length() < 8) {
            throw new RuntimeException("Gebruikersnaam moet minimaal 3 tekens zijn en wachtwoord minimaal 8.");
        }
        
        // Controleer of de gebruiker al bestaat
        if (userRepository.findByUsername(username).isPresent() || userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Deze gebruikersnaam of dit e-mailadres is al in gebruik.");
        }
        
        // Wachtwoord beveiliging
        String hashedPassword = passwordEncoder.encode(password);
        
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setEmail(email);
        newUser.setPasswordHash(hashedPassword);
        newUser.setRole("ROLE_USER"); 
        
        userRepository.save(newUser);
        System.out.println("LOG: Gebruiker " + username + " opgeslagen in PostgreSQL.");
    }

    /**
     * 2. ALLE GEBRUIKERS OPHALEN (Voor je Admin Tabel)
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
     * 4. PROFIEL OPHALEN
     */
    public UserProfileDTO getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("Profiel niet gevonden."));
        
        UserProfileDTO dto = new UserProfileDTO();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        return dto;
    }

    /**
     * 5. PROFIEL BIJWERKEN
     */
    public void updateUserProfile(String username, UpdateProfileRequest request) {
        User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("Gebruiker niet gevonden."));
        
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        if (request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
            if (request.getNewPassword().length() < 8) {
                 throw new RuntimeException("Nieuw wachtwoord moet minimaal 8 tekens lang zijn.");
            }
            user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        }
        
        userRepository.save(user);
    }
}
