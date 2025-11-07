// RegistrationRequest.java (Maak deze klasse aan)
package com.abelsoftware123.registratie.controller; // Of een dto subpackage

public class RegistrationRequest {
    // Let op: variabelen moeten exact overeenkomen met de JSON keys die de frontend verstuurt!
    private String username;
    private String email;
    private String password;

    // Getters en Setters (cruciaal voor Spring om de JSON te deserialiseren)
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
