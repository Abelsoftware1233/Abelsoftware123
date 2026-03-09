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
                // OPENBARE BESTANDEN
                .requestMatchers(
                    "/",
                    "/index.html",
                    "/registreer.html", // Let op: je file heet 'registreer.html'
                    "/login.html", 
                    "/api/register",    // Matcht met UserController
                    "/api/login",
                    "/*.css", 
                    "/*.js",
                    "/*.png", "/*.jpg", "/*.ico" 
                ).permitAll()

                // ADMIN GEDEELTE (Vereist ROLE_ADMIN in de database)
                .requestMatchers("/admin.html", "/api/admin/**").hasRole("ADMIN")

                // PROFIEL GEDEELTE
                .requestMatchers("/profiel.html", "/api/user/**").authenticated()

                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login.html")
                .loginProcessingUrl("/perform_login")
                .defaultSuccessUrl("/profiel.html", true) 
                .failureUrl("/login.html?error=true")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/perform_logout")
                .logoutSuccessUrl("/login.html?logout=true")
                .deleteCookies("JSESSIONID")
                .permitAll()
            );

        return http.build();
    }
}
