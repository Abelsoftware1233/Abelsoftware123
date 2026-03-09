package com.abelsoftware123.registratie.repository;

import com.abelsoftware123.registratie.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Nodig voor de DataInitializer en de login
    Optional<User> findByUsername(String username);
    
    // Handig voor login via e-mail of profielchecks
    Optional<User> findByEmail(String email);

    // Deze wordt specifiek gebruikt in je UserService.registerNewUser
    // om in één keer te checken of een account al bestaat.
    boolean existsByUsernameOrEmail(String username, String email);
}
