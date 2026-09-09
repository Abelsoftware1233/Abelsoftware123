// UpdateProfileRequest.java
package com.abelsoftware123.registratie.dto;

public class UpdateProfileRequest {
    private String email;
    private String firstName;
    private String lastName;
    private String newPassword; // Optioneel: alleen gevuld als het wachtwoord wordt gewijzigd

    // Getters en Setters

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
