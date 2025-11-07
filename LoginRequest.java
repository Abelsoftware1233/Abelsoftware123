// LoginRequest.java
package com.abelsoftware123.registration.controller;

public class LoginRequest {
    // Variabelen moeten overeenkomen met de JSON keys: username en password
    private String username;
    private String password;

    // Zorg ervoor dat de Getters en Setters aanwezig zijn
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
