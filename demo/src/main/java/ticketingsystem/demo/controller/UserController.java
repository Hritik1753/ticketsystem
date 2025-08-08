package ticketingsystem.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ticketingsystem.demo.dto.LoginRequest;
import ticketingsystem.demo.dto.UserRequest;
import ticketingsystem.demo.dto.UserResponse;
import ticketingsystem.demo.entity.User;
import ticketingsystem.demo.service.UserService;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Register user
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody UserRequest userRequest) {
        User createdUser = userService.registerUser(userRequest);
        return ResponseEntity.ok(createdUser);
    }

    // Login user
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> user = userService.loginUser(loginRequest);
        if (user.isPresent()) {
            User u = user.get();
            return ResponseEntity.ok(
                    new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getRole().toString()));
            // return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }

       // ✅ Find user by ID
    @GetMapping("/find/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        if (user.isPresent()) {
            User u = user.get();
            return ResponseEntity.ok(
                    new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getRole().toString()));
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }
    
    // ✅ Get all users
@GetMapping
public ResponseEntity<?> getAllUsers() {
    return ResponseEntity.ok(userService.getAllUsers());
}
    
@GetMapping("/by-role")
public ResponseEntity<?> getUsersByRole(@RequestParam String role) {
    return ResponseEntity.ok(userService.getUsersByRole(role));
}

// ✅ Update user
@PutMapping("/{id}")
public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserRequest userRequest) {
    System.out.println("===== [DEBUG] Entered updateUser endpoint =====");
    System.out.println("[DEBUG] Received ID: " + id);
    System.out.println("[DEBUG] Received Request Body: " + userRequest);

    try {
        Object updatedUser = userService.updateUser(id, userRequest);
        System.out.println("[DEBUG] Update successful: " + updatedUser);
        return ResponseEntity.ok(updatedUser);
    } catch (RuntimeException e) {
        System.out.println("[DEBUG] Exception occurred: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.status(404).body(e.getMessage());
    }
}


// ✅ Delete user
@DeleteMapping("/{id}")
public ResponseEntity<?> deleteUser(@PathVariable Long id) {
    try {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    } catch (RuntimeException e) {
        return ResponseEntity.status(404).body(e.getMessage());
    }
}



}
