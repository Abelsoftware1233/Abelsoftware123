// LoginResponse.java
package com.abelsoftware123.registratie.dto;

public class LoginResponse {
    private String token;
    private String message;

    // Constructor is nodig om het object gemakkelijk aan te maken
    public LoginResponse(String token, String message) {
        this.token = token;
        this.message = message;
    }
    
    // Getters en Setters

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
