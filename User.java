package com.abelsoftware123.registratie.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users") 
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    @Column(unique = true, nullable = false)
    private String email;

    // Dit veld zorgt ervoor dat Spring Security weet of je een USER of ADMIN bent
    @Column(nullable = false)
    private String role = "ROLE_USER"; 

    // Extra velden voor het profiel
    private String firstName;
    private String lastName;

    // --- CONSTRUCTORS ---
    
    // Lege constructor is verplicht voor JPA
    public User() {}

    // Handige constructor voor registratie
    public User(String username, String email, String passwordHash) {
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = "ROLE_USER";
    }

    // --- GETTERS EN SETTERS ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
}
