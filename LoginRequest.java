// LoginRequest.java
package com.abelsoftware123.registratie.dto;

public class LoginRequest {
    private String usernameOrEmail;
    private String password;

    // Getters en Setters
    public String getUsernameOrEmail() { return usernameOrEmail; }
    public void setUsernameOrEmail(String usernameOrEmail) { this.usernameOrEmail = usernameOrEmail; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
