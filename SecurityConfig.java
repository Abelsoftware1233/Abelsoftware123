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

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); 
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) 
            .authorizeHttpRequests(auth -> auth
                // OPENBARE BESTANDEN (Alles staat direct in de hoofdmap)
                .requestMatchers(
                    "/register.html", 
                    "/login.html", 
                    "/api/registreer", 
                    "/api/login", 
                    "/api/users/**",
                    "/*.css",    // Pakt alle CSS in de hoofdmap
                    "/*.js"      // Pakt alle JS in de hoofdmap (script.js, admin-script.js)
                ).permitAll()

                // ADMIN GEDEELTE
                .requestMatchers("/admin.html", "/api/admin/**").hasRole("ADMIN")

                // PROFIEL GEDEELTE
                .requestMatchers("/profiel.html", "/api/profile/**").authenticated()

                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login.html")
                .loginProcessingUrl("/perform_login")
                .defaultSuccessUrl("/profiel.html", true) // Direct naar het HTML bestand
                .failureUrl("/login.html?error=true")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/perform_logout")
                .logoutSuccessUrl("/login.html?logout=true")
                .permitAll()
            );

        return http.build();
    }
}
