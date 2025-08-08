package ticketingsystem.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ticketingsystem.demo.entity.Ticket;
import ticketingsystem.demo.entity.TicketStatus;
import ticketingsystem.demo.repository.CommentRepository;
import ticketingsystem.demo.repository.TicketRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private CommentRepository commentRepository;
     
    public Ticket createTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Optional<Ticket> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }

    @Transactional
    public void deleteTicket(Long ticketId) {
        commentRepository.deleteByTicketId(ticketId);
        ticketRepository.deleteById(ticketId);
    }

    // public void deleteTicket(Long id) {
    //     ticketRepository.deleteById(id);
    // }

    public List<Ticket> getTicketsByUser(Long userId) {
    return ticketRepository.findByUserId(userId);
    }

    public List<Ticket> getTicketsByStatus(String status) {
    return ticketRepository.findByStatus(status);
    }

    public List<Ticket> getTicketsSortedByCreatedAt() {
        return ticketRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Ticket> getTicketsByAssignedToId(Long assignedToId) {
        return ticketRepository.findByAssignedToId(assignedToId);
    }
    
     // ✅ Assign or reassign ticket to a support agent
    public Ticket assignTicket(Long ticketId, Long agentId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setAssignedToId(agentId);
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    // ✅ Update ticket status
    public Ticket updateTicketStatus(Long ticketId, TicketStatus status) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setStatus(status);
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }
}
