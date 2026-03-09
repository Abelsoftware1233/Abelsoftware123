package com.abelsoftware123.registratie.repository;

import com.abelsoftware123.registratie.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Deze methode is nodig om de admin te vinden bij het opstarten
    // En voor de login-logica later
    Optional<User> findByUsername(String username);
    
    // Optioneel: handig als je ook op email wilt kunnen zoeken
    Optional<User> findByEmail(String email);
}
