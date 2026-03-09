package com.abelsoftware123.registratie.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Bean voor het veilig versleutelen van wachtwoorden
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); 
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CSRF uitschakelen voor API-tests met Postman/JS (in productie later aanzetten)
            .csrf(csrf -> csrf.disable()) 
            
            .authorizeHttpRequests(auth -> auth
                // 1. OPENBARE TOEGANG: Iedereen mag registreren en inloggen
                .requestMatchers(
                    "/api/registreer", 
                    "/api/login", 
                    "/register.html", 
                    "/login.html", 
                    "/api/users/**",
                    "/style.css",    // Zorg dat je CSS en JS ook bereikbaar zijn
                    "/script.js"
                ).permitAll()

                // 2. ADMIN TOEGANG: Alleen voor gebruikers met de rol ADMIN
                .requestMatchers("/admin.html", "/api/admin/**", "/admin-script.js").hasRole("ADMIN")

                // 3. GEBRUIKER TOEGANG: Profiel vereist alleen een geldige login
                .requestMatchers("/profiel", "/profiel.html", "/api/profile/**").authenticated()

                // 4. REST: Al het andere vereist ook een login
                .anyRequest().authenticated()
            )
            
            // Configuratie van het inlogformulier
            .formLogin(form -> form
                .loginPage("/login.html")
                .loginProcessingUrl("/perform_login")
                .defaultSuccessUrl("/profiel", true)
                .failureUrl("/login.html?error=true")
                .permitAll()
            )
            
            // Configuratie van het uitloggen
            .logout(logout -> logout
                .logoutUrl("/perform_logout")
                .logoutSuccessUrl("/login.html?logout=true")
                .permitAll()
            );

        return http.build();
    }
}
