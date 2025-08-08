package ticketingsystem.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.BeanDefinitionDsl.Role;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ticketingsystem.demo.dto.LoginRequest;
import ticketingsystem.demo.dto.UserRequest;
import ticketingsystem.demo.entity.User;
import ticketingsystem.demo.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    public User registerUser(UserRequest userRequest) {
       
     if (userRepository.existsByEmail(userRequest.getEmail())) {
        throw new RuntimeException("User already exists with this email!");
    }

        User user = new User();
        user.setName(userRequest.getName());
        user.setEmail(userRequest.getEmail());
        user.setRole(ticketingsystem.demo.entity.Role.valueOf(userRequest.getRole().toUpperCase()));
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));

            // Send welcome email
        emailService.sendEmail(
        userRequest.getEmail(),
        "Welcome to Ticketing System",
        "Hi " + user.getName() + ",\n\nYour signup was successful!\n\nRegards,\nTicketing System"
       );
        return userRepository.save(user);

      
    }

    public Optional<User> loginUser(LoginRequest loginRequest) {
        Optional<User> user = userRepository.findByEmail(loginRequest.getEmail());
        if (user.isPresent() && passwordEncoder.matches(loginRequest.getPassword(), user.get().getPassword())) {
            return user;
        }
        return Optional.empty();
    }
    
     // ✅ Get user by ID
     public Optional<User> getUserById(Long id) {
         return userRepository.findById(id);
     }

       // ✅ Get all users
       public List<User> getAllUsers() {
           return userRepository.findAll();
       }
    // ✅ Get users by role
    public List<User> getUsersByRole(String role) {
        try {
            ticketingsystem.demo.entity.Role enumRole = ticketingsystem.demo.entity.Role.valueOf(role.toUpperCase());
            return userRepository.findByRole(enumRole);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + role);
        }
    }

    // ✅ Update user
    public User updateUser(Long id, UserRequest userRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Update fields if provided
        if (userRequest.getName() != null) {
            user.setName(userRequest.getName());
        }
        if (userRequest.getEmail() != null) {
            // Optional: Check if email already exists for another user
            if (userRepository.existsByEmail(userRequest.getEmail())
                    && !user.getEmail().equals(userRequest.getEmail())) {
                throw new RuntimeException("Email already in use by another user!");
            }
            user.setEmail(userRequest.getEmail());
        }
        if (userRequest.getRole() != null) {
            user.setRole(ticketingsystem.demo.entity.Role.valueOf(userRequest.getRole().toUpperCase()));
        }
        if (userRequest.getPassword() != null && !userRequest.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        }

        return userRepository.save(user);
    }

    // ✅ Delete user
public void deleteUser(Long id) {
    if (!userRepository.existsById(id)) {
        throw new RuntimeException("User not found with id: " + id);
    }
    userRepository.deleteById(id);
}


}