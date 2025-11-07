// UserRepository.java (moet in een 'repository' pakket)
package com.abelsoftware123.registratie.repository;

import com.abelsoftware123.registratie.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
