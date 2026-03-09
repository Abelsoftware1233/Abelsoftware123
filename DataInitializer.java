package com.abelsoftware123.registratie.config;

import com.abelsoftware123.registratie.model.User;
import com.abelsoftware123.registratie.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Check of de admin al bestaat om dubbele accounts te voorkomen
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@abelsoftware123.com");
                // We hashen het wachtwoord direct hier
                admin.setPasswordHash(passwordEncoder.encode("admin123"));
                admin.setRole("ROLE_ADMIN");
                admin.setFirstName("abelsoftware123");
                admin.setLastName("Admin");

                userRepository.save(admin);
                System.out.println("✅ Automatisch admin-account aangemaakt: admin / admin1501");
            } else {
                System.out.println("ℹ️ Admin-account bestond al, geen actie nodig.");
            }
        };
    }
}
