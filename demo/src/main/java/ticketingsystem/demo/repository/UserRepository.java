package ticketingsystem.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ticketingsystem.demo.entity.User;

import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
    
    List<User> findByRole(ticketingsystem.demo.entity.Role role);

}
