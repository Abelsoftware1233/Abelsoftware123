package com.abelsoftware123.registratie.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Dit zorgt ervoor dat wachtwoorden veilig met BCrypt worden gehasht
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable() // Schakel CSRF uit voor testen met Postman
            .authorizeHttpRequests()
            .requestMatchers("/api/users/**").permitAll() // Laat iedereen bij de user-endpoints
            .anyRequest().authenticated();
        
        return http.build();
    }
}
