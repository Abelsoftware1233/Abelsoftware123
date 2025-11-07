package com. abelsoftware123.registratie.model;

import javax.persistence.*;

@Entity
@Table(name = "users") 
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    private String passwordHash; // Hier slaan we de gehashte versie op

    @Column(unique = true, nullable = false)
    private String email;

    // Construteur, Getters en Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    // Voeg eventueel een lege constructor toe (nodig voor JPA)
    public User() {}
}
