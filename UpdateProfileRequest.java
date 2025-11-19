// UpdateProfileRequest.java (voor de POST /api/profile/update body)
package com.abelsoftware123.registratie.dto;

// Dit zijn de gegevens die de frontend (script.js) naar de server stuurt
public class UpdateProfileRequest {
    private String email;
    private String firstName;
    private String lastName;
    private String newPassword; // Kan null zijn als wachtwoord niet wordt gewijzigd

    // Voeg hier de Getters en Setters toe
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    // ... en zo verder voor firstName, lastName, newPassword
}
