package ticketingsystem.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private Priority priority; // LOW, MEDIUM, HIGH, URGENT

    @Enumerated(EnumType.STRING)
    private TicketStatus status; // OPEN, IN_PROGRESS, RESOLVED, CLOSED

    // Just store the user ID instead of full User entity
    @Column(name = "user_id")
    private Long userId;

    // AssignedTo ID instead of full User entity
    @Column(name = "assigned_to_id")
    private Long assignedToId;

    // @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    // private List<Comment> comments;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
