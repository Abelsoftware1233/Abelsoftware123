package com.jouwgamedomein.registratie.service;

import com.jouwgamedomein.registratie.model.User;
import com.jouwgamedomein.registratie.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    public User registerNewUser(String username, String email, String rawPassword) {
        
        // 1. Validatie: Check of gebruikersnaam al bestaat
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Gebruikersnaam '"+username+"' bestaat al!");
        }

        // 2. Maak User-object aan
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setEmail(email);

        // 3. Wachtwoord HASHEN (Veiligheid!)
        String hashedPassword = passwordEncoder.encode(rawPassword);
        newUser.setPasswordHash(hashedPassword);

        // 4. Opslaan in de database
        return userRepository.save(newUser);
    }
}
// Binnen src/main/java/com/jouwgamedomein/registratie/service/UserService.java

// ... (Bestand begint met imports en de class definitie) ...

public boolean verifyLogin(String username, String rawPassword) {
    
    // 1. Zoek de gebruiker op basis van de gebruikersnaam
    Optional<User> userOptional = userRepository.findByUsername(username);

    if (userOptional.isEmpty()) {
        return false; // Gebruiker bestaat niet
    }

    User user = userOptional.get();
    
    // 2. Vergelijk het ingevoerde wachtwoord met de opgeslagen hash
    // Dit is de veilige manier om in te loggen!
    return passwordEncoder.matches(rawPassword, user.getPasswordHash());
}

// ... (Rest van de UserService, inclusief registerNewUser, blijft hetzelfde) ...
