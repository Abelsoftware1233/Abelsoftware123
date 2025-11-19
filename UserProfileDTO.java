// UserProfileDTO.java (voor de GET /api/profile response)
package com.abelsoftware123.registratie.dto;

// Dit zijn de gegevens die de server terugstuurt naar het script.js
public class UserProfileDTO {
    private String username;
    private String email;
    private String firstName;
    private String lastName;

    // Voeg hier de Getters en Setters toe (of gebruik Lombok)
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    // ... en zo verder voor email, firstName, lastName
}
