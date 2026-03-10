package com.abelsoftware123.registratie.controller;

import com.abelsoftware123.registratie.model.User; // Zorg dat de import klopt met jouw project
import com.abelsoftware123.registratie.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserRestController {

    private final UserService userService;

    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    // Dit stuurt de lijst met gebruikers naar je admin.js fetch()
    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAllUsers(); // Zorg dat deze methode in je UserService staat
    }

    // Dit laat je gebruikers verwijderen via de knop in de tabel
    @DeleteMapping("/{id}")
    public void deleteUser(@往PathVariable Long id) {
        userService.deleteUserById(id);
    }
}
package com.abelsoftware123.registratie.controller;

import com.abelsoftware123.registratie.model.User; // Zorg dat de import klopt met jouw project
import com.abelsoftware123.registratie.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserRestController {

    private final UserService userService;

    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    // Dit stuurt de lijst met gebruikers naar je admin.js fetch()
    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAllUsers(); // Zorg dat deze methode in je UserService staat
    }

    // Dit laat je gebruikers verwijderen via de knop in de tabel
    @DeleteMapping("/{id}")
    public void deleteUser(@往PathVariable Long id) {
        userService.deleteUserById(id);
    }
}
