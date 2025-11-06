package com.jouwgamedomein.registratie.config;

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

    // Deze Bean is essentieel voor het hashen van wachtwoorden in UserService
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); 
    }

    // Dit is een simpele configuratie om Spring Security niet overal in de weg te laten zitten
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable() // Schakel CSRF uit voor nu (vereenvoudigt API tests)
            .authorizeRequests()
            .antMatchers("/api/registreer", "/api/login", "/register.html", "/login.html").permitAll() // Sta toegang toe tot registratie en login
            .anyRequest().authenticated(); // Alle andere requests vereisen inloggen

        return http.build();
    }
}
// Binnen SecurityConfig.java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        // ... (Vorige instellingen blijven gelijk) ...
        .authorizeRequests()
        .antMatchers("/api/registreer", "/api/login", "/register.html", "/login.html").permitAll() // Openbare pagina's
        .antMatchers("/profiel", "/profiel.html").authenticated() // ⬅️ NIEUW: Profiel vereist inloggen!
        .anyRequest().authenticated()
        
        // Voeg de Spring Security login functionaliteit toe:
        .and()
        .formLogin()
            .loginPage("/login.html") // Gebruik je eigen inlogpagina
            .loginProcessingUrl("/perform_login") // Waar het formulier naartoe POST't (standaard Spring pad)
            .defaultSuccessUrl("/profiel", true) // Stuur naar profiel na succesvol inloggen
            .failureUrl("/login.html?error=true")
            
        .and()
        .logout()
            .logoutUrl("/perform_logout")
            .logoutSuccessUrl("/login.html?logout=true");

    return http.build();
}

