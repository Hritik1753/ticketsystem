// TicketRepository.java
package ticketingsystem.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ticketingsystem.demo.entity.Ticket;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
     // 1. Get all tickets created by a specific user
    List<Ticket> findByUserId(Long userId);

    // 2. Search tickets by status
    List<Ticket> findByStatus(String status);

    // 3. Sort tickets by creation date (descending)
    List<Ticket> findAllByOrderByCreatedAtDesc();

    // 4. (Optional) Sort by priority
    List<Ticket> findAllByOrderByPriorityAsc(); // or Desc

    List<Ticket> findByAssignedToId(Long assignedToId);
}



