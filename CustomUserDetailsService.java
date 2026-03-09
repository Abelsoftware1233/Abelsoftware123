package com.abelsoftware123.registratie.service;

import com.abelsoftware123.registratie.model.User;
import com.abelsoftware123.registratie.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // We zoeken de gebruiker op in de database
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Gebruiker niet gevonden met username: " + username));

        // Hier koppelen we de rol uit de database aan Spring Security
        // Belangrijk: De rol in de DB moet "ROLE_ADMIN" of "ROLE_USER" zijn
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(user.getRole());

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPasswordHash(), // Zorg dat dit matcht met de veldnaam in User.java
                Collections.singletonList(authority)
        );
    }
}
