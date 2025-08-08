package ticketingsystem.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ticketingsystem.demo.entity.Role;
import ticketingsystem.demo.entity.Ticket;
import ticketingsystem.demo.entity.TicketStatus;
import ticketingsystem.demo.entity.User;
import ticketingsystem.demo.service.TicketService;
import ticketingsystem.demo.service.UserService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private UserService userService;

    // Create Ticket
    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody Ticket ticket) {
        Ticket created = ticketService.createTicket(ticket);
        return ResponseEntity.ok(created);
    }

    // Get All Tickets
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        List<Ticket> tickets = ticketService.getAllTickets();
        return ResponseEntity.ok(tickets);
    }

    // Get Ticket by ID
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        Optional<Ticket> ticket = ticketService.getTicketById(id);
        return ticket.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }



    @GetMapping("/assigned/{assignedToId}")
     public ResponseEntity<List<Ticket>> getTicketsByAssignedToId(@PathVariable Long assignedToId) {
    // Debug: Log the ID received from the request
    List<Ticket> tickets = ticketService.getTicketsByAssignedToId(assignedToId);

    // If no tickets found, log and return 204 No Content
    if (tickets.isEmpty()) {
        System.out.println("DEBUG: No tickets found for assignedToId = " + assignedToId);
        return null;
    }
    return ResponseEntity.ok(tickets);
}

    // 4. Get Tickets by User ID
    @GetMapping("/user/{userId}")
    public List<Ticket> getTicketsByUser(@PathVariable Long userId) {
        return ticketService.getTicketsByUser(userId);
    }

    // 5. Get Tickets by Status
    @GetMapping("/status/{status}")
    public List<Ticket> getTicketsByStatus(@PathVariable String status) {
        return ticketService.getTicketsByStatus(status);
    }

    // 6. Get Sorted Tickets by Creation Date Descending
    @GetMapping("/sorted/latest")
    public List<Ticket> getTicketsSortedByCreatedAt() {
        return ticketService.getTicketsSortedByCreatedAt();
    }

    // Delete Ticket
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    // ------------------- ADMIN FUNCTIONS -------------------

    // 1️⃣ Admin assigns ticket to a Support Agent
    @PutMapping("/{ticketId}/assign/{agentId}")
    public ResponseEntity<Ticket> assignTicket(
            @PathVariable Long ticketId,
            @PathVariable Long agentId) {

        User agent = userService.getUserById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        if (agent.getRole() != Role.SUPPORT_AGENT) {
            throw new RuntimeException("User is not a support agent");
        }

        Ticket updatedTicket = ticketService.assignTicket(ticketId, agentId);
        return ResponseEntity.ok(updatedTicket);
    }

    // ------------------- SUPPORT AGENT FUNCTIONS -------------------

    // 2️⃣ Support Agent changes ticket status
    @PutMapping("/{ticketId}/status")
    public ResponseEntity<Ticket> updateTicketStatus(
            @PathVariable Long ticketId,
            @RequestParam TicketStatus status) {
        Ticket updatedTicket = ticketService.updateTicketStatus(ticketId, status);
        return ResponseEntity.ok(updatedTicket);
    }

    // 3️⃣ Support Agent reassigns ticket to another Support Agent
    @PutMapping("/{ticketId}/reassign/{newAgentId}")
    public ResponseEntity<Ticket> reassignTicket(
            @PathVariable Long ticketId,
            @PathVariable Long newAgentId) {

        User newAgent = userService.getUserById(newAgentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        if (newAgent.getRole() != Role.SUPPORT_AGENT) {
            throw new RuntimeException("User is not a support agent");
        }

        Ticket updatedTicket = ticketService.assignTicket(ticketId, newAgentId);
        return ResponseEntity.ok(updatedTicket);
    }

}
